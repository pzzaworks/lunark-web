"use client";
import { useState, useEffect, useCallback, useRef, use } from "react";
import { flushSync } from "react-dom";
import { motion } from "framer-motion";
import Chat from "@/components/Chat/Chat";
import Navbar from "@/components/Navbar/Navbar";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { IMessage } from "@/types/message";
import { useUserContext, useSocketContext } from "@/contexts";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { createAxiosInstance } from "@/lib/axios";
import { useAppKitNetwork } from "@reown/appkit/react";

const globalFetchTracker = new Map<string, boolean>();

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);
  const { user } = useUserContext();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStatus, setStreamStatus] = useState<string>(
    "Lunark is thinking...",
  );
  const socketRef = useRef<Socket | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const hasAttemptedConnection = useRef(false);
  const router = useRouter();
  const { chainId } = useAppKitNetwork();
  const [lastChunk, setLastChunk] = useState("");
  const isStreamingRef = useRef(false);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const hasCheckedInitialMessage = useRef(false);

  const {
    socket,
    isConnected,
    currentChatId,
    stopStream,
    startStream,
    joinChat,
    pendingTransaction,
    clearPendingTransaction,
  } = useSocketContext();

  const handleStreamResponse = useCallback((data: any) => {
    const message: IMessage = {
      id: data.messageId || Date.now().toString(),
      chatId: data.chatId,
      role: data.role,
      content: data.message || "",
      transaction: data.transaction || null,
      toolData: data.toolData || null,
      memories: data.memories || [],
      userId: data.userId,
      createdAt: new Date(data.timestamp),
      updatedAt: new Date(data.timestamp),
    };

    if (!message.content) {
      return;
    }
    if (message.content.trim() === "") {
      return;
    }

    setLoading(false);

    if (!isStreamingRef.current && message.content.trim()) {
      isStreamingRef.current = true;
      setIsStreaming(true);
    }

    // Use flushSync to force immediate render (disable React 18 batching)
    flushSync(() => {
      setMessages((prev) => {
        const messageIndex = prev.findIndex((m) => m.id === message.id);

        if (messageIndex === -1) {
          return [...prev, message];
        }

        const updatedMessages = [...prev];
        const currentMessage = prev[messageIndex];

        updatedMessages[messageIndex] = {
          ...currentMessage,
          content: message.content,
          memories: message.memories || currentMessage.memories,
        };

        return updatedMessages;
      });
    });
  }, []);

  const handleStreamEnd = useCallback(() => {
    requestAnimationFrame(() => {
      isStreamingRef.current = false;
      setIsStreaming(false);
      setLoading(false);
      setLastChunk("");
    });
  }, []);

  const handleStreamStatus = useCallback(({ status }: { status: string }) => {
    setStreamStatus(status);
  }, []);

  useEffect(() => {
    if (!chatId || !user?.id) {
      return;
    }

    // Join chat when socket is available and connected
    if (socket?.connected) {
      joinChat(chatId);
    }

    // Listen for socket connection changes
    const handleConnect = () => {
      if (chatId && user?.id) {
        joinChat(chatId);
      }
    };

    socket?.on("connect", handleConnect);

    return () => {
      socket?.off("connect", handleConnect);
      if (socket?.connected) {
        socket.emit("leaveChat", { chatId });
      }
    };
  }, [chatId, user?.id, socket, joinChat]);

  useEffect(() => {
    if (!socket?.connected || !currentChatId) {
      return;
    }

    socket.on("streamResponse", handleStreamResponse);
    socket.on("streamEnd", handleStreamEnd);
    socket.on("streamStatus", handleStreamStatus);

    return () => {
      socket.off("streamResponse", handleStreamResponse);
      socket.off("streamEnd", handleStreamEnd);
      socket.off("streamStatus", handleStreamStatus);
    };
  }, [
    socket?.connected,
    currentChatId,
    handleStreamResponse,
    handleStreamEnd,
    handleStreamStatus,
  ]);

  // When pendingTransaction arrives, attach it to the last assistant message
  useEffect(() => {
    if (!pendingTransaction || pendingTransaction.chatId !== chatId) return;

    const attachTransaction = () => {
      setMessages((prev) => {
        // Find the last lunark message
        const lastLunarkIndex = prev.findLastIndex((m) => m.role === "lunark");
        if (lastLunarkIndex === -1) {
          // No lunark message yet, will retry
          return prev;
        }

        // Check if this message already has a transaction
        if (prev[lastLunarkIndex].transaction) {
          return prev;
        }

        const updatedMessages = [...prev];
        updatedMessages[lastLunarkIndex] = {
          ...updatedMessages[lastLunarkIndex],
          transaction: {
            id: pendingTransaction.id,
            hash: null,
            status: "pending",
            type: pendingTransaction.type,
            data: {
              transaction: pendingTransaction.transaction,
              details: pendingTransaction.details,
              buttonText: pendingTransaction.buttonText,
              chainId: pendingTransaction.transaction.chainId,
            },
            userId: user?.id || "",
            messageId: updatedMessages[lastLunarkIndex].id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        return updatedMessages;
      });
    };

    // Try to attach immediately
    attachTransaction();

    // Retry a few times in case lunark message hasn't arrived yet
    const retryIntervals = [100, 300, 500, 1000, 2000];
    const timeouts = retryIntervals.map((delay) =>
      setTimeout(() => {
        setMessages((prev) => {
          const lastLunarkIndex = prev.findLastIndex((m) => m.role === "lunark");
          if (lastLunarkIndex !== -1 && !prev[lastLunarkIndex].transaction) {
            attachTransaction();
          }
          return prev;
        });
      }, delay)
    );

    // Clear the pending transaction from context after last retry
    const finalClearTimeout = setTimeout(() => {
      clearPendingTransaction();
    }, 2500);

    return () => {
      timeouts.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(finalClearTimeout);
    };
  }, [pendingTransaction, chatId, clearPendingTransaction, user?.id]);

  useEffect(() => {
    if (!user?.id || !chatId || globalFetchTracker.get(chatId)) return;

    globalFetchTracker.set(chatId, true);

    let isMounted = true;
    fetchControllerRef.current = new AbortController();

    const fetchMessages = async () => {
      if (!isMounted) return;

      try {
        const { data } = await createAxiosInstance().get(
          `/api/chat/${chatId}`,
          {
            params: { userId: user?.id },
            signal: fetchControllerRef.current?.signal,
          },
        );

        if (!isMounted) return;

        if (data.userId !== user?.id) {
          router.push("/");
          return;
        }

        // Chat found and belongs to user, set messages (even if empty)
        setMessages(data.messages || []);
        setInitialLoading(false);
      } catch (error) {
        if (!isMounted) return;
        setInitialLoading(false);
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
      fetchControllerRef.current?.abort();
      fetchControllerRef.current = null;
    };
  }, [user?.id, chatId, router]);

  useEffect(() => {
    return () => {
      globalFetchTracker.delete(chatId);
    };
  }, [chatId]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "user" && !isStreaming) {
      const previousMessage = messages[messages.length - 2];
      if (!previousMessage || previousMessage.role === "lunark") {
        setLoading(true);

        const currentTime = new Date().getTime();
        const messageTime = new Date(lastMessage.createdAt).getTime();
        const timeDifference = (currentTime - messageTime) / 1000 / 60;

        if (timeDifference >= 5) {
          setLoading(false);
        }
      }
    }
  }, [messages, isStreaming]);

  const handleSubmit = async (value: string) => {
    if (!value.trim() || !chainId || loading || isStreaming) {
      return;
    }
    if (!isConnected) {
      return;
    }

    const tempUserMessage: IMessage = {
      id: Date.now().toString(),
      chatId: chatId,
      role: "user",
      content: value,
      transaction: null,
      toolData: null,
      memories: [],
      userId: user?.id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setInputValue("");
    setLoading(true);

    isStreamingRef.current = false;
    setIsStreaming(false);
    setLastChunk("");

    try {
      if (isStreamingRef.current) {
        stopStream();
        socket?.emit("streamAbort", { chatId: chatId });
        isStreamingRef.current = false;
        setIsStreaming(false);
        setLoading(false);
        return;
      }

      startStream();
      await createAxiosInstance().post(`/api/message`, {
        chatId,
        content: value,
        chainId,
        userId: user?.id,
      });
    } catch (error: any) {
      console.error("Failed to send message:", error);

      // Remove temporary user message
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id),
      );

      // Reset all streaming and loading states
      isStreamingRef.current = false;
      setIsStreaming(false);
      setLoading(false);
      setStreamStatus("Lunark is thinking...");

      // Show specific error message from backend if available
      const errorMessage = error.response?.data?.message || "Failed to send message";
      toast.error(errorMessage);
    }
  };

  const handleStreamControl = useCallback(() => {
    if (isStreamingRef.current) {
      stopStream();
      socket?.emit("streamAbort", { chatId: chatId });
      isStreamingRef.current = false;
      setIsStreaming(false);
      setLoading(false);
      setStreamStatus("Lunark is thinking...");
    }
  }, [stopStream, socket, chatId]);

  // Check for initial message from home page
  useEffect(() => {
    if (
      !initialLoading &&
      messages.length === 0 &&
      user?.id &&
      chainId &&
      isConnected &&
      !hasCheckedInitialMessage.current
    ) {
      hasCheckedInitialMessage.current = true;
      const storageKey = `initialMessage_${chatId}`;
      const initialMessage = sessionStorage.getItem(storageKey);

      if (initialMessage) {
        sessionStorage.removeItem(storageKey);
        // Automatically submit the initial message
        setTimeout(() => {
          handleSubmit(initialMessage);
        }, 100);
      }
    }
  }, [initialLoading, messages.length, user?.id, chainId, isConnected, chatId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isStreamingRef.current) {
        handleStreamControl();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleStreamControl]);

  return (
    <main className="flex flex-col w-screen min-h-screen bg-black overflow-hidden py-6">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6">
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl mx-auto relative min-h-[calc(100vh-212px)]"
        >
          {initialLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingIcon />
            </div>
          ) : (
            <Chat
              messages={messages}
              inputValue={inputValue}
              isConnected={!loading && isConnected && !initialLoading}
              onSubmit={handleSubmit}
              onInputChange={setInputValue}
              loading={loading}
              isStreaming={isStreaming}
              onStreamControl={handleStreamControl}
              socketStatus={streamStatus}
            />
          )}
        </motion.div>
      </div>
    </main>
  );
}

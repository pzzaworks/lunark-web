"use client"

import { baseContainerStyle } from "@/constants";
import { Copy, ThumbsDown, ThumbsUp } from "iconoir-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { createAxiosInstance } from "@/lib/axios";
import Button from '../Base/Button';

interface MessageActionsProps {
  content: string;
  role: string;
  messageId: string;
  initialFeedback?: 'liked' | 'disliked' | null;
}

export default function MessageActions({ content, role, messageId, initialFeedback }: MessageActionsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(initialFeedback === 'liked');
  const [isDisliked, setIsDisliked] = useState(initialFeedback === 'disliked');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(!!initialFeedback);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.trim());
      setIsCopied(true);
      toast.success('Copied message to clipboard!');
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLike = async () => {
    if (isSubmitting || role !== 'lunark' || hasFeedback) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    if (isDisliked) setIsDisliked(false);

    if (newLikedState) {
      setIsSubmitting(true);
      try {
        await createAxiosInstance().post('/api/message/feedback', {
          messageId,
          feedback: 'liked',
          content: content.trim()
        });
        toast.success('Thanks for the positive feedback!');
        setHasFeedback(true);
      } catch (error: any) {
        console.error('Failed to submit feedback:', error);
        toast.error('Failed to save feedback');
        setIsLiked(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDislike = async () => {
    if (isSubmitting || role !== 'lunark' || hasFeedback) return;

    const newDislikedState = !isDisliked;
    setIsDisliked(newDislikedState);
    if (isLiked) setIsLiked(false);

    if (newDislikedState) {
      setIsSubmitting(true);
      try {
        await createAxiosInstance().post('/api/message/feedback', {
          messageId,
          feedback: 'disliked',
          content: content.trim()
        });
        toast.success('Thanks for the feedback! We\'ll work on improving.');
        setHasFeedback(true);
      } catch (error: any) {
        console.error('Failed to submit feedback:', error);
        toast.error('Failed to save feedback');
        setIsDisliked(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={`absolute ${role === 'user' ? 'right-2' : 'left-2'} -bottom-6`}>
      <div className={`${baseContainerStyle} flex items-center gap-1 px-1 py-1 rounded-lg`}>
        <Button
          variant="ghost"
          size="sm"
          rounded="lg"
          onClick={handleCopy}
          className="!px-1 !py-0 h-[18px] w-[50px] sm:h-[20px] sm:w-[60px] text-sky-600 hover:text-sky-500 !gap-1"
        >
          {!isCopied && <Copy className="w-3 h-3" />}
          <span className="text-[10px] sm:text-[12px]">
            {isCopied ? 'Copied!' : 'Copy'}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          rounded="lg"
          onClick={handleLike}
          disabled={isSubmitting || role !== 'lunark' || hasFeedback}
          className={`!px-0 !py-0 h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] transition-all ${isLiked
              ? 'text-green-300 !bg-green-500/40 !border-green-400/80 border shadow-[0_0_15px_rgba(34,197,94,0.5),inset_0_0_15px_rgba(34,197,94,0.2)]'
              : 'text-green-600 hover:text-green-500'
            }`}
        >
          {isLiked ? (
            <ThumbsUp className="w-3 h-3 fill-current" strokeWidth={0} />
          ) : (
            <ThumbsUp className="w-3 h-3" strokeWidth={2} />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          rounded="lg"
          onClick={handleDislike}
          disabled={isSubmitting || role !== 'lunark' || hasFeedback}
          className={`!px-0 !py-0 h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] transition-all ${isDisliked
              ? 'text-rose-300 !bg-rose-500/40 !border-rose-400/80 border shadow-[0_0_15px_rgba(244,63,94,0.5),inset_0_0_15px_rgba(244,63,94,0.2)]'
              : 'text-rose-600 hover:text-rose-500'
            }`}
        >
          {isDisliked ? (
            <ThumbsDown className="w-3 h-3 fill-current" strokeWidth={0} />
          ) : (
            <ThumbsDown className="w-3 h-3" strokeWidth={2} />
          )}
        </Button>
      </div>
    </div>
  );
}
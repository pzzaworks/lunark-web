"use client"

import { motion, AnimatePresence } from "framer-motion";
import NetworkButtonMobile from './NetworkButtonMobile';
import BalanceButtonMobile from "./BalanceButtonMobile";
import { Archive, BookStack, LogOut, Plus, Settings, Wallet } from "iconoir-react";
import { baseButtonStyle } from "@/constants";
import { createAxiosInstance } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAppKitNetwork } from '@reown/appkit/react';
import { useState } from 'react';
import { useGlobalContext } from '@/contexts';
import Button from '../Base/Button';

interface MobileMenuProps {
  user: any;
  status: any;
  displayAddress: string;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  toggleMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  user,
  status,
  displayAddress,
  handleConnect,
  handleDisconnect,
  toggleMenu
}) => {
  const router = useRouter();
  const { chainId } = useAppKitNetwork();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { setIsSettingsOpen } = useGlobalContext();

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
    toggleMenu();
  };

  const createNewChat = async () => {
    if (!status || !user || !chainId || isCreatingChat) return;

    setIsCreatingChat(true);
    try {
      const response = await createAxiosInstance().post('/api/chat', {
        userId: user.id,
        chainId,
        message: "Hi Lunark!"
      });
      router.push(`/chat/${response.data.chatId}`);
      toggleMenu();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create new chat');
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
    >
      <div className="flex flex-col items-center justify-center mx-auto w-[224px] h-full gap-4 px-4">
        {!user ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Button
              disabled={!status}
              onClick={handleConnect}
              variant="default"
              size="md"
              rounded="full"
              fullWidth
            >
              Sign in
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="w-full flex items-center justify-center">
              <Button
                onClick={createNewChat}
                loading={isCreatingChat}
                icon={Plus}
                variant="default"
                size="md"
                rounded="full"
                fullWidth
                className="h-[40px]"
              >
                New Chat
              </Button>
            </div>
            <div className="w-full flex items-center justify-center">
              <NetworkButtonMobile showLabel className="w-full h-[40px]" />
            </div>
            <a
              href="/wallet"
              className={`${baseButtonStyle} flex items-center gap-2 justify-center w-full px-3 h-[40px] rounded-full cursor-pointer`}
              onClick={toggleMenu}
            >
              <Wallet height={21} width={21} />
              Wallet
            </a>
            <a
              href="/history"
              className={`${baseButtonStyle} flex items-center gap-2 justify-center w-full px-3 h-[40px] rounded-full cursor-pointer`}
              onClick={toggleMenu}
            >
              <Archive height={21} width={21} />
              History
            </a>
            <Button
              onClick={handleSettingsOpen}
              icon={Settings}
              variant="default"
              size="md"
              rounded="full"
              fullWidth
              className="h-[40px]"
            >
              Settings
            </Button>
            <a
              href="/docs"
              className={`${baseButtonStyle} flex items-center gap-2 justify-center w-full px-3 h-[40px] rounded-full cursor-pointer`}
              onClick={toggleMenu}
            >
              <BookStack height={22} width={22} />
              Documentation
            </a>
            <Button
              onClick={handleDisconnect}
              icon={LogOut}
              variant="danger"
              size="md"
              rounded="full"
              fullWidth
              className="h-[40px]"
            >
              Sign Out
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MobileMenu;
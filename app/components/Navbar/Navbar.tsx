"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, BookStack, Menu, Xmark, Archive, Plus, Settings, Wallet } from 'iconoir-react';
import { useAppKitAccount, useAppKit, useAppKitNetwork } from '@reown/appkit/react';
import NetworkButton from './NetworkButton';
import Link from 'next/link';
import { useGlobalContext, useUserContext } from '@/contexts';
import Image from 'next/image';
import MobileMenu from './MobileMenu';
import BalanceButton from './BalanceButton';
import SettingsPopup from '../Popup/SettingsPopup/index';
import { ethers } from 'ethers';
import Tooltip from '../Base/Tooltip';
import { createAxiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Button from '../Base/Button';


const iconLinkStyle = `
  flex items-center justify-center
  h-10 w-10
  rounded-full
  text-[#FCFCFC]
  cursor-pointer
  border border-[#888]/30
  bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.25)_100%)]
  hover:border-[#aaa]/50 hover:bg-[radial-gradient(70%_70%_at_center,rgba(8,10,12,0.98)_0%,rgba(160,165,180,0.35)_100%)]
  transition-all duration-200 ease-in-out
`;

const menuItemsVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.05,
    }
  },
  closed: {
    x: 50,
    opacity: 0,
    transition: {
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.05,
    }
  }
} as const;

const itemVariant = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      stiffness: 300,
      damping: 24
    }
  },
  closed: {
    x: 50,
    opacity: 0,
    transition: {
      stiffness: 300,
      damping: 24
    }
  }
} as const;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { user, disconnect } = useUserContext();
  const router = useRouter();
  const { address } = useAppKitAccount();
  const { open } = useAppKit();
  const { status, isSettingsOpen, setIsSettingsOpen } = useGlobalContext();
  const { chainId } = useAppKitNetwork();
  const [displayAddress, setDisplayAddress] = useState('');

  useEffect(() => {
    if (!address) {
      setDisplayAddress('');
      return;
    }
    setDisplayAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
  }, [address]);

  const handleConnect = async () => {
    try {
      await open();
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to disconnect');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(!isDesktopMenuOpen);
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
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create new chat');
    } finally {
      setIsCreatingChat(false);
    }
  };

  const renderConnectButton = () => (
    <motion.div
      key="connect-button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="default"
        size="md"
        rounded="full"
        disabled={!status}
        onClick={handleConnect}
        className="px-8"
      >
        Sign in
      </Button>
    </motion.div>
  );

  const renderMenuItems = () => (
    <motion.div
      initial="closed"
      animate={isDesktopMenuOpen ? "open" : "closed"}
      variants={menuItemsVariants}
      className={`flex items-center gap-3 absolute right-[52px] ${!isDesktopMenuOpen ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      key="desktop-menu"
    >
      <motion.div variants={itemVariant}>
        <Tooltip text="New Chat">
          <Button
            variant="default"
            rounded="full"
            onClick={createNewChat}
            loading={isCreatingChat}
            icon={Plus}
            iconOnly
          />
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <NetworkButton />
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="Wallet">
          <Link href="/wallet" className={iconLinkStyle}>
            <Wallet height={21} width={21} />
          </Link>
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="History">
          <Link href="/history" className={iconLinkStyle}>
            <Archive height={21} width={21} />
          </Link>
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="Docs">
          <Link href="/docs" className={iconLinkStyle}>
            <BookStack height={22} width={22} />
          </Link>
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="Settings">
          <Button
            variant="default"
            rounded="full"
            onClick={() => setIsSettingsOpen(true)}
            icon={Settings}
            iconOnly
          />
        </Tooltip>
      </motion.div>
      <motion.div variants={itemVariant}>
        <Tooltip text="Sign Out">
          <Button
            variant="default"
            rounded="full"
            onClick={handleDisconnect}
            icon={LogOut}
            iconOnly
            className="border-red-500/50 hover:border-red-500/75"
          />
        </Tooltip>
      </motion.div>
    </motion.div>
  );

  return (
    <nav className="w-full pb-2 sm:pb-4 sm:pt-4 relative">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center relative z-50">
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-semibold"
            style={{
              background: 'linear-gradient(180deg, #000000 0%, #4E4A46 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            href="/"
          >
            <Image src="/images/icons/icon-light.svg" alt="Lunark AI" width={256} height={256} className='w-12 h-12 object-contain' loading="eager" />
          </motion.a>
          <div className="hidden md:flex items-center relative">
            <AnimatePresence mode="wait">
              {!user ? (
                renderConnectButton()
              ) : (
                <>
                  {renderMenuItems()}
                  <div className="flex items-center gap-3">
                    <AnimatePresence mode="wait">
                      {!isDesktopMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, width: 0 }}
                          animate={{ opacity: 1, scale: 1, width: "auto" }}
                          exit={{ opacity: 0, scale: 0.8, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Tooltip text="New Chat">
                            <Button
                              variant="default"
                              rounded="full"
                              onClick={createNewChat}
                              loading={isCreatingChat}
                              icon={Plus}
                              iconOnly
                            />
                          </Tooltip>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Tooltip text={isDesktopMenuOpen ? "Close Menu" : "Open Menu"}>
                      <motion.div
                        initial={false}
                        animate={{
                          rotate: isDesktopMenuOpen ? 180 : 0,
                          scale: isDesktopMenuOpen ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          rounded="full"
                          onClick={toggleDesktopMenu}
                          icon={isDesktopMenuOpen ? Xmark : Menu}
                          iconOnly
                          className="z-10"
                        />
                      </motion.div>
                    </Tooltip>
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            className="md:hidden flex items-center z-50"
            initial={false}
            animate={{
              rotate: isMenuOpen ? 180 : 0,
              scale: isMenuOpen ? 1.2 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              rounded="full"
              onClick={toggleMenu}
              icon={isMenuOpen ? Xmark : Menu}
              iconOnly
            />
          </motion.div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <MobileMenu
            user={user}
            status={status}
            displayAddress={displayAddress}
            handleConnect={handleConnect}
            handleDisconnect={handleDisconnect}
            toggleMenu={toggleMenu}
          />
        )}
      </AnimatePresence>
      <SettingsPopup
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </nav>
  );
}

export default Navbar;
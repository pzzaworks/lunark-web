"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { baseContainerStyle } from '@/constants';
import { Xmark, Settings as SettingsIcon, User, Book } from 'iconoir-react';
import Button from '../../Base/Button';
import { useUserContext, useGlobalContext } from '@/contexts';
import { createAxiosInstance } from '@/lib/axios';
import Popup from '../Popup';
import GeneralSettings from './GeneralSettings';
import ProfileSettings from './ProfileSettings';
import { toast } from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import ContractSettings from './ContractSettings';

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: <SettingsIcon className="w-5 h-5 min-w-5 min-h-5" />,
  },
  {
    id: 'contracts',
    label: 'Contracts',
    icon: <Book className="w-5 h-5 min-w-5 min-h-5" />,
  },
  {
    id: 'profile',
    label: 'Account',
    icon: <User className="w-5 h-5 min-w-5 min-h-5" />,
  },
];

const SettingsPopup: React.FC<SettingsPopupProps> = ({ isOpen, onClose }) => {
  const { selectedMenu, setSelectedMenu } = useGlobalContext();
  const [showDeleteChatsConfirmation, setShowDeleteChatsConfirmation] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isDeletingChats, setIsDeletingChats] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const { user, disconnect } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen && user) {
      fetchChatCount();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const fetchChatCount = async () => {
    if (!user) return;

    try {
      const { data } = await createAxiosInstance().get(`/api/history`, {
        params: {
          userId: user.id,
          limit: -1
        }
      });
      setChatCount(data.history?.length || 0);
    } catch (error) {
      console.error('Failed to fetch chat count:', error);
      setChatCount(0);
    }
  };

  const handleDeleteAllChats = async () => {
    if (!user) return;
    
    setIsDeletingChats(true);
    try {
      // First get all chat IDs
      const { data } = await createAxiosInstance().get(`/api/history`, {
        params: {
          userId: user.id,
          limit: -1
        }
      });

      // Then delete all chats using the history DELETE endpoint
      await createAxiosInstance().delete('/api/history', {
        data: {
          ids: data.history.map((chat: any) => chat.id),
          userId: user.id
        }
      });

      setShowDeleteChatsConfirmation(false);
      toast.success('All chats deleted successfully');
      setChatCount(0);

      // If we're in a chat view, redirect to home page
      if (pathname?.startsWith('/chat/')) {
        router.push('/');
      }
    } catch (error: any) {
      console.error('Failed to delete all chats:', error);
      toast.error(error.response?.data?.error || 'Failed to delete all chats');
    } finally {
      setIsDeletingChats(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnect();
      onClose();
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'general':
        return (
          <GeneralSettings
            language={language}
            setLanguage={setLanguage}
            onDeleteAllChats={() => setShowDeleteChatsConfirmation(true)}
            onDisconnect={handleDisconnect}
            isDeleting={isDeletingChats}
            isDisconnecting={isDisconnecting}
            chatCount={chatCount}
          />
        );
      case 'profile':
        return (
          <ProfileSettings
            onClose={onClose}
          />
        );
      case 'contracts':
        return <ContractSettings />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-6 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${baseContainerStyle} rounded-xl w-full max-w-3xl h-[500px] max-h-[90vh] flex flex-col sm:flex-row overflow-hidden relative`}
            onClick={e => e.stopPropagation()}
          >
            <Button
              onClick={onClose}
              variant="default"
              size="md"
              rounded="full"
              icon={Xmark}
              iconOnly
              className="absolute top-4 right-4 z-10"
            />
            <div className="flex-none w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-[#888]/30">
              <div className="p-4">
                <div className="flex sm:block items-center justify-between mb-4 sm:mb-0">
                  <h2 className="text-[#FCFCFC] font-medium text-lg">Settings</h2>
                </div>
                <div className="sm:mt-6 grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      onClick={() => setSelectedMenu(item.id)}
                      variant="default"
                      size="md"
                      rounded="full"
                      className={`w-full justify-start gap-3 ${
                        selectedMenu === item.id ? '!bg-[rgba(255,255,255,0.25)]' : ''
                      }`}
                    >
                      {item.icon}
                      <span className="text-[#FCFCFC]">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              {renderContent()}
            </div>
          </motion.div>

          <Popup
            isOpen={showDeleteChatsConfirmation}
            onClose={() => setShowDeleteChatsConfirmation(false)}
            onConfirm={handleDeleteAllChats}
            title="Delete All Chats"
            message="Are you sure you want to delete all your chats? This action cannot be undone."
            confirmText="Delete All"
            cancelText="Cancel"
            type="danger"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsPopup; 
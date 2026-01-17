"use client"
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useGlobalContext, useUserContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from './components/Navbar/Navbar';
import toast from 'react-hot-toast';
import { createAxiosInstance } from './lib/axios';
import { useAppKitNetwork } from '@reown/appkit/react';
import OnboardingPopup from './components/Popup/OnboardingPopup';
import {
  HeroSection,
  FeaturesSection,
  ForEveryoneSection,
  ChatSection,
  CTASection,
} from '@/components/Sections';
import { HomeFooter } from '@/components/Footer';
import { useSocketContext } from '@/contexts';
export default function Home() {
  const router = useRouter();
  const { user } = useUserContext();
  const { status, fetchStatus } = useGlobalContext();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { chainId } = useAppKitNetwork();
  const { socket, isConnected, joinChat } = useSocketContext();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hasCompletedOnboarding')) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleSubmit = async (value: string) => {
    if (!value.trim() || !chainId || loading) return;

    try {
      await fetchStatus();

      if (!user || !status) {
        return;
      }

      if (!(user?.termsSignature)) {
        toast.error('You must accept the terms and conditions to use Lunark AI.');
        return;
      }

      // Check balance before creating chat
      if (!user.balance || user.balance < 0.001) {
        toast.error('Insufficient balance. Please add balance to continue using Lunark AI.');
        return;
      }

      try {
        setLoading(true);
        const { data } = await createAxiosInstance().post('/api/chat', {
          message: value,
          userId: user.id,
          chainId
        });

        if (data?.chatId) {
          // Wait for socket connection
          if (!isConnected) {
            await new Promise((resolve) => {
              const checkConnection = setInterval(() => {
                if (isConnected) {
                  clearInterval(checkConnection);
                  resolve(true);
                }
              }, 100);

              setTimeout(() => {
                clearInterval(checkConnection);
                resolve(false);
              }, 2000);
            });
          }

          // Join chat room
          joinChat(data.chatId);

          // Store the initial message in sessionStorage so the chat page can send it
          sessionStorage.setItem(`initialMessage_${data.chatId}`, value);

          // Navigate to chat page
          router.push(`/chat/${data.chatId}`);
        }
      } catch (error: any) {
        setLoading(false);
        toast.error(error.response?.data?.message || 'Failed to create chat');
      }
    } catch (error) {
      toast.error('Failed to verify connection status.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-hidden">
        <motion.div
          className="absolute top-0 inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/images/bg.png"
            alt="Background"
            fill
            priority
            className="object-cover"
            quality={100}
            sizes="100vw"
            unoptimized
          />
        </motion.div>
        <motion.div
          className="fixed top-0 left-0 right-0 z-50"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full max-w-[1280px] mx-auto mt-6 px-4 sm:px-6">
            <Navbar />
          </div>
        </motion.div>
        <main className="relative z-10 min-h-screen bg-transparent py-20">
          <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 overflow-hidden pt-6">
            <HeroSection
              inputValue={inputValue}
              onSubmit={handleSubmit}
              onChange={setInputValue}
              disabled={!user || loading || !status}
              loading={loading}
              status={!!status}
            />
            <ForEveryoneSection />
            <FeaturesSection />
            <ChatSection />
            <CTASection />
            <HomeFooter />
          </div>
        </main>
      </div>
      <OnboardingPopup isOpen={showOnboarding} onClose={handleCloseOnboarding} />
    </>
  );
}
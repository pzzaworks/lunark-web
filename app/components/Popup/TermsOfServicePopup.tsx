"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Checkbox from '../Base/Checkbox';
import Button from '../Base/Button';
import Link from '../Base/Link';
import { useGlobalContext, useUserContext } from '@/contexts';
import { createAxiosInstance } from '@/lib/axios';
import { usePathname } from 'next/navigation';
import { Check } from 'iconoir-react';
import { baseContainerStyle } from '@/constants';

interface Props {
  onAccept?: () => void;
}

const TermsOfServicePopup: React.FC<Props> = ({ onAccept }) => {
  const pathname = usePathname();
  const { ethersSigner } = useGlobalContext();
  const { user, setUser } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (pathname === '/terms' || pathname === '/privacy') return;

    if (user?.termsSignature) {
      setIsOpen(false);
      setHasAccepted(true);
    } else {
      setIsOpen(true);
      setHasAccepted(false);
    }
  }, [user]);

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

  const handleAccept = async () => {
    if (!ethersSigner || !hasAccepted) return;

    try {
      const message = "I hereby acknowledge and accept Lunark AI's Terms of Service and Privacy Policy. I understand that I am bound by these agreements to use the platform.";
      const signature = await ethersSigner.signMessage(message);

      const response = await createAxiosInstance().post('/api/user/terms', {
        signature
      });

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsOpen(false);
        onAccept?.();
      }
    } catch (error) {
      console.error('Failed to update terms:', error);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${baseContainerStyle} rounded-xl max-w-xl w-full max-h-[70vh] flex flex-col`}
          >
            <div className="px-6 py-3 border-b border-[#888]/30">
              <h2 className="text-xl font-medium text-[#FCFCFC]">Terms of Services</h2>
            </div>
            <div className="p-6 overflow-y-auto w-full">
              <div className="space-y-4 text-gray-300">
                <p>
                  To use Lunark AI's services, you must accept our <Link href="/terms" variant="primary" external>Terms of Service</Link> and <Link href="/privacy" variant="primary" external>Privacy Policy</Link>. These agreements establish the framework for our relationship and detail how our platform operates. They comprehensively outline your rights and responsibilities, data handling practices, service limitations, and usage guidelines.
                </p>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-[#888]/30 w-full">
              <div className="flex flex-col sm:flex-row gap-4 justify-end sm:justify-between items-center w-full">
                <label className="flex items-start gap-2 text-sm text-gray-300 cursor-pointer">
                  <div className='mt-2 mr-2'>
                    <Checkbox
                      checked={hasAccepted}
                      onChange={(e) => setHasAccepted(e.target.checked)}
                    />
                  </div>
                  <span className='select-none'>
                    I acknowledge that I have read and agree to the <Link href="/terms" variant="primary" external onClick={(e) => e.stopPropagation()}>Terms of Service</Link> and <Link href="/privacy" variant="primary" external onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>.
                  </span>
                </label>
                <Button
                  onClick={handleAccept}
                  disabled={!hasAccepted}
                  variant="default"
                  size="md"
                  rounded="full"
                  icon={Check}
                  iconPosition="left"
                  className="select-none sm:ms-auto"
                >
                  Accept
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsOfServicePopup;
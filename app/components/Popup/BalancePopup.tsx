"use client";
import { balanceOptions, baseContainerStyle } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';
import Checkbox from '../Base/Checkbox';
import Input from '../Base/Input';
import Button from '../Base/Button';
import Link from '../Base/Link';
import { useState, useEffect } from 'react';
import Popup from './Popup';
import { Brain, Check } from 'iconoir-react';
import { api } from '@/lib/axios';
import { useUserContext } from '@/contexts';

interface BalancePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (amount: number) => void;
  loading: boolean;
}

const BalancePopup: React.FC<BalancePopupProps> = ({ isOpen, onClose, onSelect, loading }) => {
  const { user } = useUserContext();
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempSelectedPrice, setTempSelectedPrice] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkWaitlistStatus = async () => {
    if (!user?.address) return;

    setIsChecking(true);
    try {
      const { data } = await api.get(`/api/waitlist/check/wallet/${user.address}`);
      if (data.isOnWaitlist) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('Error checking waitlist status:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleWaitlistSubmit = async (value: string) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post('/api/waitlist', {
        email: value,
        walletAddress: user?.address || null
      });
      setIsSubmitted(true);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setIsSubmitted(true);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to join waitlist. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';

      checkWaitlistStatus();

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, user?.address]);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setIsSubmitted(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSelect = (price: number) => {
    if (!loading) {
      setTempSelectedPrice(price);
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    if (tempSelectedPrice !== null) {
      setSelectedPrice(tempSelectedPrice);
      onSelect(tempSelectedPrice);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-6"
            onClick={loading ? undefined : onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${baseContainerStyle} rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden`}
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-[#888]/30 flex-shrink-0">
                <h2 className="text-xl font-medium text-[#FCFCFC]">Add Balance</h2>
                <p className="text-sm text-[#5e8284] mt-1">Select a package and add balance to use Lunark AI</p>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex flex-col items-center gap-4 w-full">
                  <p className="text-sm text-[#5e8284] text-center">
                    Lunark AI is launching soon. Join our waitlist to get early access.
                  </p>
                  {isChecking ? (
                    <div className="py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#5e8284] border-t-transparent" />
                    </div>
                  ) : !isSubmitted ? (
                    <div className="flex flex-col items-center gap-3 w-full max-w-xs py-8">
                      <Input
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="Enter your email"
                        disabled={isSubmitting}
                      />
                      {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                      )}
                      <Button
                        onClick={() => email.trim() && handleWaitlistSubmit(email.trim())}
                        disabled={!email.trim() || isSubmitting}
                        loading={isSubmitting}
                        rounded="full"
                        className="mt-3"
                      >
                        Join Waitlist
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-8">
                      <div className="bg-green-500/10 rounded-full p-2">
                        <Check className="text-green-400 w-5 h-5" />
                      </div>
                      <p className="text-sm text-[#FCFCFC]">You're on the waitlist!</p>
                    </div>
                  )}
                  {/* {balanceOptions.map((option, index) => {
                    const isSelected = loading && selectedPrice === option.price;
                    return (
                      <motion.button
                        key={option.price}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.2,
                          scale: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.15 },
                          delay: index * 0.1
                        }}
                        onClick={() => handleSelect(option.price)}
                        disabled={loading}
                        className={`${baseButtonStyle} select-none flex sm:flex-row flex-col gap-2 sm:gap-4 items-center w-1/4 justify-center p-3
                          ${option.isRecommended ? 'border-orange-500' : ''}
                          ${loading && !isSelected ? '!opacity-25' : ''}
                          rounded-xl`}
                      >
                        {!isSelected && (
                          <div className="bg-[rgba(255,255,255,0.1)] rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">
                            <Brain className={`text-[#FCFCFC] ${
                              index === 0 ? 'h-[12px] w-[12px]' :
                              index === 1 ? 'h-[16px] w-[16px]' :
                              index === 2 ? 'h-[19px] w-[19px]' :
                              'h-[21px] w-[21px]'
                            }`} />
                          </div>
                        )}
                        {isSelected && (
                          <div className="rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">
                            <LoadingIcon isSmall />
                          </div>
                        )}
                        {!isSelected && (
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[#FCFCFC]">${option.price}</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })} */}
                </div>
                <div className="flex flex-col gap-4 mt-6">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      scale: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.15 },
                      delay: 0.4
                    }}
                    className="text-sm text-[#5e8284]"
                  >
                    We recommend starting with the smallest package for new users to explore the platform before deciding to add more balance. Credits are non-refundable. Service availability depends on system status.
                  </motion.p>
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.2,
                        scale: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.15 },
                        delay: 0.6
                      }}
                    >
                      <Checkbox checked={true} onChange={() => {}} />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.2,
                        scale: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.15 },
                        delay: 0.5
                      }}
                      className="text-sm text-[#5e8284]"
                    >
                      By adding balance, you acknowledge and agree to Lunark AI's <Link href="/terms" variant="primary" external>Terms of Service</Link> and <Link href="/privacy" variant="primary" external>Privacy Policy</Link>.
                    </motion.p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#888]/30 flex-shrink-0">
                <div className="flex justify-end">
                  <Button
                    onClick={onClose}
                    disabled={loading}
                    variant="ghost"
                    rounded="full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Popup
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        title="Confirm Purchase"
        message={`Are you sure you want to add $${tempSelectedPrice} to your balance?`}
        confirmText="Yes, Continue"
        cancelText="Cancel"
        type="info"
      />
    </>
  );
};

export default BalancePopup;
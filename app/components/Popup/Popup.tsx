"use client";
import { baseContainerStyle } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Button from '../Base/Button';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
  children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  children
}) => {
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

  const getButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'secondary';
      default:
        return 'primary';
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${baseContainerStyle} rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden`}
            onClick={e => e.stopPropagation()}
          >
            {children ? (
              children
            ) : (
              <>
                <div className="px-6 py-4 border-b border-[#888]/30 flex-shrink-0">
                  <h2 className="text-xl font-medium text-[#FCFCFC]">{title}</h2>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <p className="text-gray-300">{message}</p>
                </div>
                <div className="px-6 py-4 border-t border-[#888]/30 flex-shrink-0">
                  <div className="flex justify-end gap-3">
                    <Button onClick={onClose} variant="ghost" rounded="full">
                      {cancelText}
                    </Button>
                    {onConfirm && (
                      <Button
                        onClick={() => {
                          onConfirm();
                          onClose();
                        }}
                        variant={getButtonVariant()}
                        rounded="full"
                        className={type === 'info' ? '!bg-green-500 hover:!bg-green-600' : ''}
                      >
                        {confirmText}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;

"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { baseContainerStyle } from '@/constants';
import { Xmark } from 'iconoir-react';
import Input from '../Base/Input';
import Button from '../Base/Button';
import Textarea from '../Base/Textarea';

interface Contact {
  id: string;
  name: string;
  address: string;
  networks: string[];
  notes?: string;
  metadata?: string;
}

interface ContactFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Partial<Contact>) => Promise<void>;
  contact?: Contact | null;
  isSaving?: boolean;
}

const ContactFormPopup: React.FC<ContactFormPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  contact,
  isSaving = false
}) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    } else {
      setFormData({
        name: '',
        address: '',
        notes: ''
      });
    }
  }, [contact, isOpen]);

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

  const validateAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !validateAddress(formData.address)) {
      return;
    }
    await onSave(formData);
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${baseContainerStyle} rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden relative flex flex-col`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-none p-6 border-b border-[#888]/30">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#FCFCFC]">
                  {contact ? 'Edit Contact' : 'Add New Contact'}
                </h3>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  rounded="full"
                  icon={Xmark}
                  iconOnly
                  size="sm"
                />
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-[#5e8284] mb-2">Name</label>
                  <Input
                    value={formData.name || ''}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    placeholder="Enter contact name"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm text-[#5e8284] mb-2">Address</label>
                  <Input
                    value={formData.address || ''}
                    onChange={(value) => setFormData({ ...formData, address: value })}
                    placeholder="0x..."
                    className="font-mono"
                  />
                  {formData.address && !validateAddress(formData.address) && (
                    <p className="text-red-500 text-sm mt-1">Invalid Ethereum address format</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm text-[#5e8284] mb-2">Notes (optional)</label>
                  <Textarea
                    value={formData.notes || ''}
                    onChange={(value) => setFormData({ ...formData, notes: value })}
                    rows={3}
                    placeholder="Add any notes about this contact"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-6">
                <Button onClick={onClose} variant="ghost">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.address || !validateAddress(formData.address || '')}
                  loading={isSaving}
                  variant="primary"
                  className="!bg-green-500 hover:!bg-green-600 min-w-[7rem]"
                >
                  {contact ? 'Save Changes' : 'Add Contact'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ContactFormPopup;

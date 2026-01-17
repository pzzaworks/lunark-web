"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { baseButtonStyle } from '@/constants';
import { NavArrowDown } from 'iconoir-react';
import Image from 'next/image';
import Button from './Button';

interface DropdownProps {
  value: string;
  options: { value: string; label: string; disabled?: boolean; icon?: string }[];
  onChange: (value: string) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ value, options, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="default"
        size="md"
        rounded="full"
        fullWidth
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && (
            <Image
              src={selectedOption.icon}
              alt={selectedOption.label}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span className="text-[#FCFCFC]">{selectedOption?.label}</span>
        </div>
        <NavArrowDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`${baseButtonStyle} !duration-0 rounded-xl absolute z-[100] top-full left-0 mt-2 w-full`}
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.25))'
            }}
          >
            <div className={`overflow-hidden rounded-xl w-full max-h-48 overflow-y-auto bg-[#1A1A1A50] border border-[#2A2A2A]`}>
              {options.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="md"
                  rounded="lg"
                  fullWidth
                  disabled={option.disabled}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                    }
                  }}
                  className={`justify-start rounded-none ${
                    option.value === value ? 'bg-[rgba(255,255,255,0.1)]' : ''
                  } ${option.disabled ? 'text-[#5e8284]' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && (
                      <Image
                        src={option.icon}
                        alt={option.label}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-[#FCFCFC]">{option.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown; 
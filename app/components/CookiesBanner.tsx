"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Button from './Base/Button';

export default function CookiesBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if consent is already stored
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Small delay to show banner smoothly after page load
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed bottom-4 left-4 right-4 z-[100] md:bottom-8 md:left-8 md:right-8"
                >
                    <div className="max-w-4xl mx-auto bg-[#0A0A0A]/80 backdrop-blur-xl border border-[#333]/50 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className="text-white font-medium mb-2 text-base">We value your privacy</h3>
                            <p className="text-[#9CA3AF] text-sm leading-relaxed">
                                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/cookies" className="text-white underline decoration-white/30 hover:decoration-white transition-all">Cookies Policy</Link>.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                onClick={handleDecline}
                                variant="ghost"
                                size="md"
                                rounded="full"
                                className="flex-1 md:flex-none px-6 py-2.5 border border-[#333] text-[#9CA3AF] hover:text-white hover:border-[#666] hover:bg-[#333]/30"
                            >
                                Decline
                            </Button>
                            <Button
                                onClick={handleAccept}
                                variant="secondary"
                                size="md"
                                rounded="full"
                                className="flex-1 md:flex-none px-6 py-2.5 bg-white text-black hover:bg-[#E5E5E5] border-transparent shadow-lg shadow-white/5"
                            >
                                Accept All
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

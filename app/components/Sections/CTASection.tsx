"use client"
import { motion } from "framer-motion";
import { baseButtonStyle } from '@/constants';
import { SendDiagonal } from 'iconoir-react';

export default function CTASection() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5e8284]/5 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-8"
                >
                    <h2 className="text-lg uppercase tracking-[0.75rem] text-center mb-6 text-[#FCFCFC]">
                        Ready to Explore?
                    </h2>

                    <p className="text-[#5e8284] text-sm md:text-base max-w-2xl">
                        Join the future of decentralized interaction. Start chatting with Lunark today and experience the power of AI-driven blockchain management.
                    </p>

                    <motion.button
                        onClick={scrollToTop}
                        className={`flex items-center gap-2 px-6 py-2 text-sm text-[#FCFCFC] rounded-full ${baseButtonStyle}`}
                    >
                        <span>Get Started Now</span>
                        <SendDiagonal className="w-4 h-4" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}

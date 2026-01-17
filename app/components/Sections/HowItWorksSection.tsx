"use client"
import { motion } from "framer-motion";
import { Link, MessageText, GraphUp } from 'iconoir-react';

export default function HowItWorksSection() {
    const steps = [
        {
            icon: Link,
            title: "Connect Wallet",
            description: "Securely connect your Web3 wallet to get started with Lunark."
        },
        {
            icon: MessageText,
            title: "Ask Anything",
            description: "Type your questions or commands in natural language."
        },
        {
            icon: GraphUp,
            title: "Get Insights",
            description: "Receive real-time analysis and execute transactions instantly."
        }
    ];

    return (
        <section className="py-20 relative px-2 sm:px-0">
            <div className="max-w-5xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-lg uppercase tracking-[0.75rem] text-center mb-12 text-[#FCFCFC]"
                >
                    How It Works
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex flex-col items-center text-center gap-3"
                            >
                                <Icon className="w-6 h-6 text-[#FCFCFC]" />
                                <h3 className="text-lg text-[#FCFCFC] font-medium tracking-wide">
                                    {step.title}
                                </h3>
                                <p className="text-[#5e8284] text-sm max-w-xs">
                                    {step.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

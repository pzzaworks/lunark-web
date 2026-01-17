"use client"
import { motion } from "framer-motion";
import { baseContainerStyle } from '@/constants';
import { Copy, MessageText, SendDiagonal, ThumbsUp, ThumbsDown, Wallet, GraphUp } from 'iconoir-react';
import { processText } from '../Message/ProcessText';
import Button from '../Base/Button';

export default function ChatSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      title: "Connect Wallet",
      description: "Securely connect your Web3 wallet to get started. Lunark supports multiple chains and wallets for seamless integration.",
      icon: Wallet,
      align: "left",
      demo: (
        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-end w-full">
            <Button variant="default" size="md" rounded="full">
              Sign In
            </Button>
          </div>
          <div className="flex justify-start w-full">
            <div className={`flex items-center gap-3 p-4 pr-10 rounded-xl ${baseContainerStyle} border border-[#888]/20 min-w-[280px]`}>
              <div className="text-green-500">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[#FCFCFC] text-sm font-medium">Wallet Connected</div>
                <div className="text-[#5e8284] text-xs">0x1234...5678</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ask Anything",
      description: "Interact with the blockchain using natural language. Check balances, transfer funds, or analyze market trends just by asking.",
      icon: MessageText,
      align: "right",
      demo: (
        <div className="flex flex-col gap-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex items-start gap-3 flex-row-reverse w-full"
          >
            <div className="flex flex-col gap-2 w-full items-end">
              <div className={`group max-w-[95%] w-fit p-4 ${baseContainerStyle} rounded-xl shadow-sm break-words relative`}>
                <div className="text-[#FCFCFC] text-end">How much ETH do I have?</div>
                <div className="absolute right-2 -bottom-6">
                  <div className={`${baseContainerStyle} flex items-center gap-1 px-1 py-1 rounded-lg`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      rounded="lg"
                      icon={Copy}
                      iconPosition="left"
                      className="h-[20px] w-[60px] text-sky-600 hover:text-sky-500 !px-1 !py-0 !text-[12px]"
                    >
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      rounded="lg"
                      icon={ThumbsUp}
                      className="h-[20px] w-[20px] text-green-600 hover:text-green-500 !p-0 [&_svg]:w-3 [&_svg]:h-3"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      rounded="lg"
                      icon={ThumbsDown}
                      className="h-[20px] w-[20px] text-rose-600 hover:text-rose-500 !p-0 [&_svg]:w-3 [&_svg]:h-3"
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs text-[#4F6263] mt-6 mx-3 text-right">
                User - Just now
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex items-start gap-3 flex-row w-full"
          >
            <div className="flex flex-col gap-2 w-full items-start">
              <div className={`group max-w-[95%] w-fit p-4 ${baseContainerStyle} rounded-xl shadow-sm break-words relative`}>
                <div className="text-[#FCFCFC] text-start">
                  Your current balance is {processText('2.5 ETH')}
                </div>
                <div className="absolute left-2 -bottom-6">
                  <div className={`${baseContainerStyle} flex items-center gap-1 px-1 py-1 rounded-lg`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      rounded="lg"
                      icon={Copy}
                      iconPosition="left"
                      className="h-[20px] w-[60px] text-sky-600 hover:text-sky-500 !px-1 !py-0 !text-[12px]"
                    >
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      rounded="lg"
                      icon={ThumbsUp}
                      className="h-[20px] w-[20px] text-green-600 hover:text-green-500 !p-0 [&_svg]:w-3 [&_svg]:h-3"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      rounded="lg"
                      icon={ThumbsDown}
                      className="h-[20px] w-[20px] text-rose-600 hover:text-rose-500 !p-0 [&_svg]:w-3 [&_svg]:h-3"
                    />
                  </div>
                </div>
              </div>
              <div className="text-xs text-[#4F6263] mt-6 mx-3 text-left">
                Lunark - Just now
              </div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      title: "Get Insights",
      description: "Receive real-time analysis and execute transactions instantly. Lunark provides detailed breakdowns and safety checks.",
      icon: GraphUp,
      align: "left",
      demo: (
        <div className="flex flex-col gap-4 w-full">
          <div className={`w-full p-4 ${baseContainerStyle} rounded-xl border border-[#888]/20`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#FCFCFC] text-sm font-medium">Portfolio Analysis</span>
              <span className="text-green-400 text-xs">+12.5%</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-[#888]/20 rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-[#5e8284] rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-[#5e8284]">
                <span>ETH</span>
                <span>70%</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-[#4F6263] mt-1 mx-3 text-left">
            Lunark - Just now
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-lg uppercase tracking-[0.75rem] text-center mb-20 text-[#FCFCFC]"
        >
          How It Works
        </motion.h2>

        <div className="flex flex-col gap-24">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col md:flex-row gap-12 items-center ${step.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: step.align === 'left' ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex-1 space-y-4"
              >
                <div className="w-fit text-[#FCFCFC]">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl text-[#FCFCFC] uppercase tracking-[0.25rem] flex items-center gap-2 w-full">{step.title}</h3>
                <p className="text-[#5e8284] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Demo/Visual Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 w-full"
              >
                <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl bg-[#000]/40 border border-[#888]/20 backdrop-blur-sm overflow-hidden flex items-center justify-center p-6 md:p-10">
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5e8284]/5 to-transparent pointer-events-none" />

                  {step.demo}
                </div>
              </motion.div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
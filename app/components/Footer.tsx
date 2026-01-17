"use client"
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from './Base/Link';

export function HomeFooter() {
  return (
    <footer className="pt-20 pb-6 relative mt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 md:col-span-2"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Image
                src="/images/icons/icon-light.svg"
                alt="Lunark AI"
                width={48}
                height={48}
                className="mb-4"
                style={{ height: 'auto' }}
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-[#5e8284] mb-4"
            >
              Making blockchain human-friendly. Tell Lunark AI what you need, and watch the magic happen.
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-[#FCFCFC] font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" variant="muted">Documentation</Link></li>
              <li><Link href="https://github.com/pzzaworks/lunark" variant="muted" external>Github</Link></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-[#FCFCFC] font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" variant="muted" external>Terms of Service</Link></li>
              <li><Link href="/privacy" variant="muted" external>Privacy Policy</Link></li>
              <li><Link href="/cookies" variant="muted" external>Cookies Policy</Link></li>
            </ul>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="border-t border-[#888]/30 mt-8 pt-8 text-center text-[#5e8284]"
        >
          <p>© {new Date().getFullYear()} Lunark AI. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}

export function ChatFooter() {
  return (
    <div className="flex justify-center sm:justify-between items-center px-4 mt-4 text-xs">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.4 }}
        className="text-[#4F6263]"
      >
        Built by <span className="text-[#9CA3AF]">Lunark AI</span> © {new Date().getFullYear()}
      </motion.div>
      <div className="hidden sm:flex flex-row gap-3 text-[#4F6263] max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.5 }}
        >
          <Link href="/terms" variant="muted" size="sm" external className="hover:underline">Terms of Service</Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.5 }}
        >
          <Link href="/privacy" variant="muted" size="sm" external className="hover:underline">Privacy Policy</Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.5 }}
        >
          <Link href="/cookies" variant="muted" size="sm" external className="hover:underline">Cookies</Link>
        </motion.div>
      </div>
    </div>
  );
}

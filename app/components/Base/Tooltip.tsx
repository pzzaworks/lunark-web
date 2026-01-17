import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { baseContainerStyle } from '@/constants';

interface TooltipProps {
 text: string;
 children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
 const [isVisible, setIsVisible] = useState(false);

 return (
   <div
     className="relative inline-flex items-center justify-center"
     onMouseEnter={() => setIsVisible(true)}
     onMouseLeave={() => setIsVisible(false)}
   >
     {children}
     <AnimatePresence>
       {isVisible && (
         <motion.div
           initial={{ opacity: 0, y: -5 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -5 }}
           transition={{ duration: 0.2 }}
           className={`${baseContainerStyle} absolute hidden sm:block left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 rounded-full text-xs whitespace-nowrap z-50 pointer-events-none`}
         >
           {text}
           <div
             className={`${baseContainerStyle} absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 transform rotate-45`}
           />
         </motion.div>
       )}
     </AnimatePresence>
   </div>
 );
};

export default Tooltip;
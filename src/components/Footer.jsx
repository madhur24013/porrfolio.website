import React from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-5 px-8 bg-tertiary mt-20 relative z-10"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="text-secondary text-[14px] text-center font-medium">
          © {new Date().getFullYear()} Madhur Haryan. All rights reserved.
        </div>
        <div className="text-secondary text-[12px] mt-2 font-medium">
          Designed & Developed by Madhur Haryan
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

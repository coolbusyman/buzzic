import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-slate-900 z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
          >
            <svg width="120" height="120" viewBox="0 0 256 256">
              <rect width="256" height="256" rx="24" fill="#0f172a" />
              <g transform="rotate(-25 128 128)">
                <circle cx="106" cy="150" r="48" fill="#B87333" />
                <circle cx="140" cy="120" r="34" fill="#B87333" />
                <rect x="170" y="108" width="90" height="18" fill="#B87333" />
                <circle cx="265" cy="117" r="18" fill="#B87333" />
              </g>
            </svg>
            <div className="text-2xl font-bold tracking-widest">BUZZIC</div>
            <div className="text-sm text-slate-400">Chargement…</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

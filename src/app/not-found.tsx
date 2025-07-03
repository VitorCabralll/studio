'use client';

import { motion } from 'framer-motion';
import { Home, ArrowLeft, FileX } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FileX className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500" />
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-8xl font-bold text-gray-900 dark:text-gray-100"
          >
            404
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-semibold text-gray-700 dark:text-gray-300"
          >
            Página não encontrada
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 dark:text-gray-400 max-w-md mx-auto"
          >
            A página que você está procurando pode ter sido removida, renomeada ou não existe.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild variant="default" size="lg">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/workspace" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Ir para Workspace
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AnimatedListItem {
  id: string;
  content: React.ReactNode;
}

interface AnimatedListProps {
  items: AnimatedListItem[];
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}

export function AnimatedList({
  items,
  className,
  delay = 0,
  duration = 0.5,
  staggerDelay = 0.1,
}: AnimatedListProps) {
  const [visibleItems, setVisibleItems] = useState<AnimatedListItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      items.forEach((item, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, item]);
        }, index * staggerDelay * 1000);
      });
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [items, delay, staggerDelay]);

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence>
        {visibleItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration,
              ease: "easeOut",
            }}
          >
            {item.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function AnimatedNotification({
  notifications,
  className,
}: {
  notifications: { id: string; name: string; message: string; time: string }[];
  className?: string;
}) {
  return (
    <div className={cn("w-full max-w-sm", className)}>
      <AnimatedList
        items={notifications.map((notification) => ({
          id: notification.id,
          content: (
            <div className="flex items-start space-x-3 rounded-lg border p-3 shadow-sm bg-white dark:bg-gray-800">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {notification.name.charAt(0)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {notification.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {notification.time}
                </p>
              </div>
            </div>
          ),
        }))}
        delay={0}
        staggerDelay={0.5}
      />
    </div>
  );
}
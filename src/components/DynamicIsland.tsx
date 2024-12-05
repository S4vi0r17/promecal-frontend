import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DynamicIslandProps {
  userName: string;
  userImage?: string;
}

export function DynamicIsland({ userName, userImage }: DynamicIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-4 left-3/4 transform -translate-x-1/2 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ width: '120px', height: '32px', borderRadius: '16px' }}
          animate={
            isExpanded
              ? { width: '280px', height: '40px', borderRadius: '20px' }
              : {}
          }
          transition={{ duration: 0.3 }}
          className="bg-white text-black flex items-center shadow-xl justify-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2 px-3">
            <Avatar className="h-7 w-7">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium"
                >
                  {userName}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

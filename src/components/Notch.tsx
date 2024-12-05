import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NotchProps {
  userName: string;
  userImage?: string;
}

export function Notch({ userName, userImage }: NotchProps) {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative">
        {/* Background */}
        <div className="w-[300px] h-[40px] bg-white shadow-xl rounded-b-xl">
          <div
            className="absolute top-0 left-0 w-full h-full bg-white"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)',
            }}
          >
            <div className="flex items-center justify-center h-full px-6 space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-800 text-sm font-medium truncate">
                {userName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

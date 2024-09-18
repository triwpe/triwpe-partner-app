'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  BellIcon,
  Languages,
  LogOut,
  Menu,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

import Avatar from 'boring-avatars';
import Link from 'next/link';
import { signOut } from '@/actions/partner';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any>([
    {
      text: 'Your order has been delivered!',
      date: '2 hours ago',
      isRead: false,
    },
    {
      text: 'Your order has been delivered!',
      date: '2 hours ago',
      isRead: true,
    },
    {
      text: 'Your order has been delivered!',
      date: '2 hours ago',
      isRead: true,
    },
    {
      text: 'Your order has been delivered!',
      date: '2 hours ago',
      isRead: false,
    },
    {
      text: 'Your order has been delivered!',
      date: '2 hours ago',
      isRead: false,
    },
  ]);

  const logOut = async () => {
    await signOut();
    router.push('/sign-in');
  };

  return (
    <header className="top-0 left-0 w-full bg-muted/40 z-10 lg:z-30">
      <Card className="text-[#344054] shadow-none border-[#e0e0e0] rounded-none border-l-0">
        <CardContent className="flex h-14 items-center gap-1 px-4 lg:h-[60px] lg:px-6 py-0">
          <button
            className="lg:hidden text-gray-700 focus:outline-none"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="w-full flex-1">
            <form>
              <div className="relative"></div>
            </form>
          </div>
          <Button variant="link" size="icon">
            <Languages className="h-5 w-5" />
          </Button>
          <Button variant="link" size="icon">
            <Sun className="h-5 w-5" />
          </Button>
          <Button variant="link" size="icon">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative">
                  <div
                    className={`absolute top-0 right-0 w-2 h-2 rounded-full 
                ${
                  notifications.find((x: any) => x.isRead === false)
                    ? 'bg-red-500'
                    : 'bg-transparent'
                }`}
                  ></div>
                  <BellIcon className="h-5 w-5" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {notifications.map((notification: any, index: number) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        notification.isRead ? 'bg-transparent' : 'bg-red-500'
                      }`}
                    ></div>
                    <div>
                      <p className="text-[14px] font-bold">
                        {notification.text}
                      </p>
                      <p className="text-[12px] text-neutral-500">
                        {notification.date}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hover:cursor-pointer">
                <Avatar
                  name={user?.email}
                  variant="beam"
                  size={40}
                  colors={[
                    '#F25C54',
                    '#F27059',
                    '#f4845f',
                    '#f79d65',
                    '#f7b267',
                  ]}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <div className="flex justify-start items-center gap-2 py-1">
                  <Avatar
                    name={user?.email}
                    variant="beam"
                    size={35}
                    colors={[
                      '#F25C54',
                      '#F27059',
                      '#f4845f',
                      '#f79d65',
                      '#f7b267',
                    ]}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-neutral-500">
                      {user?.detail.businessType.toLowerCase() === 'company' ? (
                        <>{user?.detail.companyName}</>
                      ) : (
                        <>
                          {user?.detail.firstName} {user?.detail.lastName}
                        </>
                      )}
                    </p>
                    <p className="text-xs font-medium text-neutral-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <Link href="/dashboard/profile">
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  className="flex justify-start pl-0 text-left hover:bg-transparent"
                  variant="ghost"
                  onClick={logOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    </header>
  );
}

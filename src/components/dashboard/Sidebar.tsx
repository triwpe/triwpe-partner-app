import { X } from 'lucide-react';
import { Gauge, MapPinned, Map } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../public/logo2.svg';
import { Label } from '../ui/label';

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const menuIconSize = 'h-5 w-5';
  const menuList = [
    {
      menuGroup: '',
      menuItems: [
        {
          name: 'Dashboard',
          icon: <Gauge className={`${menuIconSize}`} />,
          href: '#',
          order: 0,
        },
      ],
      order: 0,
    },
    {
      menuGroup: 'GUIDES & PACKAGES',
      menuItems: [
        {
          name: 'Create Guide',
          icon: <MapPinned className={`${menuIconSize}`} />,
          href: '/dashboard/guides/new',
          order: 1,
        },
        {
          name: 'My Guides',
          icon: <Map className={`${menuIconSize}`} />,
          href: '/dashboard/guides/list',
          order: 0,
        },
      ],
      order: 1,
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-background border-r text-white transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static flex flex-col`}
    >
      <div className="flex items-center justify-between h-16 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-600"
        >
          <Image src={Logo} width={75} height={40} alt="triwpe" />
          {process.env.NEXT_PUBLIC_STAGE !== 'production' && (
            <div>| {process.env.NEXT_PUBLIC_STAGE}</div>
          )}
        </Link>
        <button
          className="text-gray-400 focus:outline-none lg:hidden"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {menuList
            .sort((a: any, b: any) => a.order - b.order)
            .map((menu: any, key: number) => (
              <div key={key} className="pb-3">
                {menu.menuGroup !== '' && (
                  <Label className="flex px-3 pb-1 text-zinc-400 text-xs">
                    {menu.menuGroup}
                  </Label>
                )}
                {menu.menuItems
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((menuItem: any, menuItemKey: number) => (
                    <Link
                      key={menuItemKey}
                      href={menuItem.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-zinc-100"
                    >
                      {menuItem.icon}
                      {menuItem.name}
                    </Link>
                  ))}
              </div>
            ))}
        </nav>
      </div>
    </div>
  );
}

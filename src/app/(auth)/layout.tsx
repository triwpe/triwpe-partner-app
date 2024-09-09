import Link from 'next/link';
import { auth } from '@/auth';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../public/logo2.svg';

interface PublicLayoutProps {
  children: ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-background shadow-none border-b border-[#e0e0e0]">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center" prefetch={false}>
            <div className="flex justify-center items-center p-2 gap-2">
              <Image src={Logo} width={125} height={40} alt="triwpe" />
              <div className="text-lg text-[#b1b1b1] font-medium">
                for partners
              </div>
            </div>
          </Link>
          <nav className="hidden gap-4 sm:flex">
            <Link
              href="#"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Help
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow flex justify-center items-center bg-gray-100">
        {children}
      </main>
      <footer className="bottom-0 left-0 right-0 py-6 text-sm text-white bg-[#21264e]">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>&copy; 2024 Triwpe. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link
              href="#"
              className="hover:underline underline-offset-4"
              prefetch={false}
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:underline underline-offset-4"
              prefetch={false}
            >
              Terms
            </Link>
            <Link
              href="#"
              className="hover:underline underline-offset-4"
              prefetch={false}
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

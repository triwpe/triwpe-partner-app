import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import Logo from "../../../public/logo.svg";

interface PublicLayoutProps {
  children: ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-background shadow">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center" prefetch={false}>
            <div className="flex justify-center items-center p-2 gap-2">
              <Image src={Logo} width={110} height={40} alt="triwpe" />
              <div className="text-md text-gray-400 font-medium">
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
      <main className="flex-grow flex justify-center items-center overflow-auto bg-gray-100">
        {children}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-muted py-6 text-sm text-muted-foreground bg-gray-200">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>&copy; 2024 Acme Inc. All rights reserved.</p>
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

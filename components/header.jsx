import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";
import HeaderActions from "@/components/header-actions";

const Header =async () => {
  const { userId } = await auth();
  await checkUser();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-md">
      <nav className="flex h-16 w-full items-center justify-between px-6 sm:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/jarai.png"
            alt="JAR AI logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          <HeaderActions isSignedIn={Boolean(userId)} />
        </div>
      </nav>

     
           
          
    </header>
  );
};

export default Header;

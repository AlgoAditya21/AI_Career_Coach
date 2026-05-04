"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, Stars as StarsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,DropdownMenuGroup,DropdownMenuLabel,DropdownMenuSeparator} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();

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
          {isLoaded && isSignedIn && (
            <>
            <Link href="/dashboard">
              <Button variant="outline" className="h-10 min-w-44 gap-2 rounded-xl px-4 font-semibold shadow-sm hover:bg-zinc-100">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-10 min-w-44 gap-2 rounded-xl bg-white px-4 font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={"/resume"} className="flex items-center gap-2">
                  <FileText className="h-4 w-4"/>
                  <span>Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
                  <PenBox className="h-4 w-4"/>
                  Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/interview"} className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4"/>
                  Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
            </>
          )}

          {isLoaded && !isSignedIn && (
            <SignInButton>
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

     
           
          
    </header>
  );
};

export default Header;

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  Stars as StarsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeaderActions({ isSignedIn }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch from Radix-generated ids by rendering menu only after mount.
  if (!mounted) {
    return <div className="h-10 w-[360px]" aria-hidden="true" />;
  }

  if (!isSignedIn) {
    return (
      <SignInButton>
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Sign In
        </button>
      </SignInButton>
    );
  }

  return (
    <>
      <Link href="/dashboard">
        <Button
          variant="outline"
          className="h-10 min-w-44 gap-2 rounded-xl px-4 font-semibold shadow-sm hover:bg-zinc-100"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden md:block">Industry Insights</span>
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-10 min-w-44 gap-2 rounded-xl bg-white px-4 font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100">
            <StarsIcon className="h-4 w-4" />
            <span className="hidden md:block">Growth Tools</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/resume" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Build Resume</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/ai-cover-letter" className="flex items-center gap-2">
              <PenBox className="h-4 w-4" />
              Cover Letter
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/interview" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
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
  );
}

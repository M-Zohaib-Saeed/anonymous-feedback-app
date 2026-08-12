"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from "next-auth"
import { MessageCircleHeart, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user = session?.user as User | undefined

  return (
    <nav className="sticky top-0 z-50 border-b bg-gray-900/95 backdrop-blur supports-backdrop-filter:bg-gray-900/80 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <MessageCircleHeart className="h-6 w-6 text-violet-400 transition-transform group-hover:scale-110" />
          <span className="text-lg md:text-xl font-bold tracking-tight">
            Anonymous Feedback
          </span>
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-slate-300">
              Welcome, <span className="font-medium text-white">{user?.username || user?.email}</span>
            </span>
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="secondary"
              size="sm"
              className="rounded-full gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto px-6 py-2.5 rounded-full bg-white text-slate-900 font-semibold border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300 active:translate-y-0 active:scale-95 cursor-pointer">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
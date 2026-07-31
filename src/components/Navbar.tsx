"use client"
import { link } from 'fs'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from "next-auth"


const Navbar = () => {
  const {data : session} = useSession()
  const user: User = session?.user



  return (
    <nav  className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a href="#" className="text-xl font-bold mb-4 md:mb-0">Anonymous feedback</a>
          {
            session ? (
             <>
              <span className="mr-4">Welcome , {user.username || user.email}</span>
              <button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" >Logout</button>
             </>
            ) : (
              <Link href='/sign-in'>
                <button className="
                      w-full md:w-auto
                      px-6 py-2.5
                      rounded-full
                      bg-white
                      text-slate-900
                      font-semibold
                      border border-slate-200
                      shadow-sm
                      transition-all duration-200
                      hover:-translate-y-0.5      
                      hover:shadow-lg
                      hover:border-slate-300
                      active:translate-y-0
                      active:scale-95 cursor-pointer">Login</button>
              </Link>
            )
          }
      </div>
    </nav>
  )
}

export default Navbar

"use client"

import React, { useEffect, useState } from 'react'
import Container from '@/components/container'
import Link from 'next/link'
import {UserButton} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import MainNav from '@/components/mainNav'
import CartActionButton from './ui/cart-action'
import { useAuth } from "@clerk/nextjs"


const Header = () => {

    const [isScrolled, setIsScrolled] = useState(false)
    const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header 
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'bg-white text-black shadow-md' 
        : 'bg-background text-foreground'
    }`}
  >
        <Container>
            <div className='relative px-4 sm:px-6 lg:px-12 flex h-16 items-center'>
                <Link href={"/"}
                        className='uppercase flex gap-x-2 font-bold text-neutral-700 text-lg md:text-xl'
                >
                    Serenity Nutrition
                </Link>
                <MainNav scrolled={isScrolled}/>
                {isSignedIn ? (
                    <div className='ml-4 flex items-center space-x-4'>
                        <UserButton afterSignOutUrl="/"/>
                        <CartActionButton/>
                    </div>
                ) : (
                    <div className='flex items-center space-x-2 ml-4'>
                        <Link
                            href={"/sign-in"}
                        >
                            <Button
                                variant={"outline"}
                            >   
                                Sign In
                            </Button>
                        </Link>
                        <Link
                            href={"/sign-up"}
                        >
                            <Button
                                variant={"outline"}
                                className='bg-green-400 text-black hover:bg-green-400'
                            >   
                                Sign Up
                            </Button>
                        </Link>
                    </div>                   
                )} 
                 
            </div>
        </Container>
    </header>
  )
}

export default Header

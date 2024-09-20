import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface MainNavProps extends React.HtmlHTMLAttributes<HTMLElement> {
    scrolled: boolean
}

const MainNav = ({ className, scrolled }: MainNavProps) => {
    const pathname = usePathname()
    const routes = [
        { href: "/", label: "Home", active: pathname === `/`, },
        { href: "/menu", label: "Menu", active: pathname === `/menu`, },
        { href: "/orders", label: "Orders", active: pathname === `/orders`, },
        { href: "/about", label: "About", active: pathname === `/about`, },
        { href: "/contact", label: "Contact", active: pathname === `/contact`, },
    ]

    return (
        <div className='ml-auto'>
            <nav className={cn("flex items-end space-x-4 lg:space-x-12 pl-6", className)}>
                {routes.map(route => (
                    <Link
                        href={route.href}
                        key={route.href}
                        className={cn(
                            "text-base font-medium transition-colors hover:text-hero",
                            route.active
                                ? scrolled
                                    ? "text-hero font-bold"
                                    : "text-black dark:text-white"
                                : scrolled
                                    ? "text-black"
                                    : "text-white"
                        )}
                    >
                        {route.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
}

export default MainNav

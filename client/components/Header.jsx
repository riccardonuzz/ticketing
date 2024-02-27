import React from 'react'
import Link from 'next/link'


const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign up', href: '/auth/signup' },
        !currentUser && { label: 'Sign in', href: '/auth/signin' },
        currentUser && { label: 'Sell tickets', href: '/tickets/new' },
        currentUser && { label: 'My orders', href: '/orders' },
        currentUser && { label: 'Sign out', href: '/auth/signout' }
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => (
            <li className='nav-item' key={href}>
                <Link href={href} className='nav-link'>{label}</Link>
            </li>
        ))

    return (
        <nav className="navbar navbar-light bg-light px-2">
            <Link href='/' className='navbar-brand'>GitTix</Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    )
}

export default Header
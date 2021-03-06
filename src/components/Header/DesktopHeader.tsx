import Link from 'next/link'
import ConnectWallet from './ConnectWallet'
import links from './links'

export default function DesktopHeader() {
    return (
        <div className="hidden md:flex px-6 pt-12 max-w-7xl mx-auto  items-center space-x-6">
            {links.map((link, index) => (
                <Link key={index} href={link.href} passHref>
                    <a target={link.target}>{link.title}</a>
                </Link>
            ))}
            <div className="flex-1" />
            <ConnectWallet />
        </div>
    )
}

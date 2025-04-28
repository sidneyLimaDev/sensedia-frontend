
import { CircleHelp, Grip } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Logo from '@/assets/Logo.svg';
import LogoPurple from '@/assets/Logo-Purple.svg';
import Image from 'next/image';


export const Header = () => {
    return (
        <header>
            <div className="bg-zinc-800 text-white flex items-center justify-between p-8">
                <div className="flex items-center">
                    <Link href="/">
                        <div className="flex items-center">
                            <Image src={Logo} alt="Logo" width={141} height={39} />
                        </div>
                    </Link>
                </div>
                <div>

                </div>
            </div>
            <div>

                <nav className="bg-white border-b border-gray-200 px-8 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                            <Image src={LogoPurple} alt="Logo" width={30} height={30} />
                            <span className="text-sm font-medium text-sensedia-purple-secundary">BEM-VINDO</span>
                        </div>
                        <Link href="/registro" className="text-sm">
                            Registro
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <CircleHelp className="w-5 h-5 text-sensedia-gray-75" />
                        <Grip className="w-5 h-5 text-sensedia-gray-75" />
                    </div>
                </nav>

            </div>
        </header>
    )
}

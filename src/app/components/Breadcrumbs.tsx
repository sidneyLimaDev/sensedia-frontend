'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

export const Breadcrumbs = () => {
    const pathname = usePathname()

    const pathSegments = pathname.split('/').filter(segment => segment)

    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/')
        const label = decodeURIComponent(segment)

        return { href, label }
    })

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:underline">
                Home
            </Link>

            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    {index === breadcrumbs.length - 1 ? (
                        <span className="text-gray-400 capitalize">{crumb.label}</span> // Último: texto
                    ) : (
                        <Link href={crumb.href} className="hover:underline capitalize">
                            {crumb.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

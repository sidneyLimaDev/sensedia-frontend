// src/components/Card.tsx
'use client'

import { useRouter } from 'next/navigation'

type CardProps = {
    title: string
    subtitle?: string
    description: string
    buttonText: string
    link: string
}

export function Card({ title, subtitle, description, buttonText, link }: CardProps) {
    const router = useRouter()

    const handleClick = () => {
        router.push(link)
    }

    return (
        <div className="p-6 border border-gray-200 rounded-lg shadow-md bg-white max-w-md mx-auto flex flex-col justify-between h-full">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                {subtitle && <h3 className="text-lg font-semibold text-gray-600 mb-4">{subtitle}</h3>}
                <p className="text-gray-500 mb-6">{description}</p>
            </div>

            <button
                onClick={handleClick}
                className="mt-auto bg-sensedia-purple-primary hover:bg-sensedia-purple-secundary text-white font-semibold py-2 px-6 rounded-lg transition cursor-pointer"
            >
                {buttonText}
            </button>
        </div>
    )
}

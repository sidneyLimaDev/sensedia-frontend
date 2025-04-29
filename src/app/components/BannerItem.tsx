'use client'

import Image from 'next/image'

type BannerItemProps = {
    title: string
    description: string
    Icon: string
}

export function BannerItem({ title, description, Icon }: BannerItemProps) {


    return (
        <div className="flex h-full gap-4 items-center">
            <div>
                <Image src={Icon} alt="Logo" width={52} height={52} />
            </div>
            <div className='flex flex-col justify-center'>
                <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                <p className="text-xl text-white font-light">{description}</p>
            </div>
        </div>
    )
}

export function BannerItemSecundary({ title, description, Icon }: BannerItemProps) {


    return (
        <div className="flex gap-3 items-start">
            <div>
                <h3 className="text-purple-600 font-medium text-base">{title}</h3>
                <div className='flex gap-4 mt-2'>
                    <div className='flex items-center'>
                        <Image src={Icon} alt="Logo" width={52} height={52} />
                    </div>
                    <div className='w-full'>
                        <p className="text-sm text-gray-600">
                            {description}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

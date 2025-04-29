import { BannerItemSecundary } from '@/app/components/BannerItem'
import FormRegister from '@/app/components/FormRegister'
import React from 'react'
import LifeRing from '@/assets/life-ring.svg'
import HeartBeat from '@/assets/heartbeat.svg'
import GrinAlt from '@/assets/grin-alt.svg'

const page = () => {
    return (
        <div>
            <div className='max-w-[875px] mx-auto'>
                <h1 className='text-3xl font-medium mt-8'>Registro</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-8">
                    <BannerItemSecundary title={'Precisa de ajuda?'} description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'} Icon={LifeRing} />
                    <BannerItemSecundary title={'Por que se registrar?'} description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'} Icon={HeartBeat} />
                    <BannerItemSecundary title={'O que está acontecendo?...'} description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'} Icon={GrinAlt} />
                </div>
            </div>
            <div className='flex justify-center max-w-[875px] mx-auto'>
                <FormRegister />
            </div>

        </div>
    )
}

export default page




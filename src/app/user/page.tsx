import React from 'react'
import UserTablePage from '../components/userTable/UserTablePage'
import { BannerItem } from '../components/BannerItem'
import Dribble from '@/assets/Dribble.svg'
import AlignLeft from '@/assets/align-left.svg'
import Trophy from '@/assets/Trophy.svg'

const page = () => {
    return (
        <div>
            <div className="bg-sensedia-purple-secundary text-white p-8">
                <div className="max-w-[875px] mx-auto">
                    <div className='flex justify-between items-center'>
                        <BannerItem title={'Tipo de Quadra'} description={'Society'} Icon={Dribble} />
                        <BannerItem title={'Nível'} description={'Semi-Profissional'} Icon={AlignLeft} />
                        <BannerItem title={'Vitórias'} description={'345'} Icon={Trophy} />
                    </div>
                </div>
            </div>
            <div>
                <div className="max-w-[875px] mx-auto mt-6">
                    <h1 className="text-3xl font-medium  mb-10">Usuários</h1>
                    <UserTablePage />
                </div>

            </div>

        </div>

    )
}

export default page
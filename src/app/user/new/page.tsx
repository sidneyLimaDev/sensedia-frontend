import FormRegister from '@/app/components/FormRegister'
import React from 'react'

const page = () => {
    return (
        <div>
            <div className='max-w-[875px] mx-auto'>
                <h1 className='text-3xl font-medium'>Registro</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex gap-3 items-start">
                        <div>
                            <h3 className="text-purple-600 font-medium text-sm">Precisa de ajuda?</h3>
                            <div className='flex'>
                                <div className='flex items-center'>
                                    <div className="bg-purple-100 p-2 rounded-full">
                                        <div className="w-6 h-6 text-purple-600">?</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                                    dolore magna aliqua.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div>
                            <h3 className="text-purple-600 font-medium text-sm">Por que se registrar?</h3>
                            <div className='flex'>
                                <div className='flex items-center'>
                                    <div className="bg-purple-100 p-2 rounded-full">
                                        <div className="w-6 h-6 text-purple-600">?</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                                    dolore magna aliqua.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div>
                            <h3 className="text-purple-600 font-medium text-sm">O que está acontecendo?...</h3>
                            <div className='flex'>
                                <div className='flex items-center'>
                                    <div className="bg-purple-100 p-2 rounded-full">
                                        <div className="w-6 h-6 text-purple-600">?</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                                    dolore magna aliqua.
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <div className='flex justify-center max-w-[875px] mx-auto'>
                <FormRegister />
            </div>

        </div>
    )
}

export default page




import React from 'react'
import UserTablePage from '../components/userTable/UserTablePage'

const page = () => {
    return (
        <div>
            <div className="bg-sensedia-purple-secundary text-white p-8">
                <div className="max-w-[875px] mx-auto">


                </div>
            </div>
            <div>

                <div className="max-w-[875px] mx-auto">
                    <h1 className="text-3xl font-medium">Usuários</h1>
                    <UserTablePage />
                </div>

            </div>

        </div>

    )
}

export default page
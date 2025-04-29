'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions/userActions'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '../types/user'
import { Check } from 'lucide-react'
import { useFormStatus } from 'react-dom'

type FormState = {
    success: boolean;
    message: string;
    errors: {
        username?: string[];
        fullName?: string[];
        email?: string[];
        city?: string[];
        password?: string[];
        days?: string[];
        selectedDays?: string[];
    };
    user?: User;
}

const initialState: FormState = {
    success: false,
    message: '',
    errors: {}
}

const daysOfWeek = [
    { label: 'Seg', value: 'Segunda' },
    { label: 'Ter', value: 'Terça' },
    { label: 'Qua', value: 'Quarta' },
    { label: 'Qui', value: 'Quinta' },
    { label: 'Sex', value: 'Sexta' },
    { label: 'Sab', value: 'Sábado' },
    { label: 'Dom', value: 'Domingo' },
]

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={`bg-sensedia-purple-primary text-white font-semibold py-3 px-8 cursor-pointer rounded-full transition ${pending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-sensedia-purple-secundary'
                }`}
        >
            {pending ? 'PROCESSANDO...' : 'REGISTRAR'}
        </button>
    )
}

export default function FormRegister() {
    const router = useRouter()
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [state, formAction] = useActionState<FormState, FormData>(createUser, initialState)

    useEffect(() => {
        if (state.success && state.user) {

            try {
                localStorage.setItem('user_id', state.user.id);

                localStorage.setItem('user_data', JSON.stringify({
                    id: state.user.id,
                    name: state.user.name,
                    email: state.user.email
                }));

                alert('Usuário criado com sucesso!');

                router.push('/user');
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        }
    }, [state.success, state.user, router]);

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target

        if (checked) {
            setSelectedDays(prev => [...prev, value])
        } else {
            setSelectedDays(prev => prev.filter(day => day !== value))
        }
    }

    return (
        <form action={formAction} className="p-8 border border-gray-200 rounded-lg  w-full">
            <h2 className="text-lg font-semibold text-sensedia-gray-50 mb-6">REGISTRO</h2>

            {state.message && !state.success && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {state.message}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Coluna da esquerda */}
                <div className="flex-1 flex flex-col gap-6">
                    <div>
                        <input
                            name="username"
                            placeholder="Nome de usuário *"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {state.errors?.username && state.errors.username.length > 0 && (
                            <p className="text-red-500 text-sm">{state.errors.username[0]}</p>
                        )}
                    </div>

                    <div>
                        <input
                            name="fullName"
                            placeholder="Nome completo *"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {state.errors?.fullName && state.errors.fullName.length > 0 && (
                            <p className="text-red-500 text-sm">{state.errors.fullName[0]}</p>
                        )}
                    </div>

                    <div>
                        <input
                            name="email"
                            placeholder="E-mail *"
                            type="email"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {state.errors?.email && state.errors.email.length > 0 && (
                            <p className="text-red-500 text-sm">{state.errors.email[0]}</p>
                        )}
                    </div>

                    <div>
                        <input
                            name="password"
                            placeholder="Senha *"
                            type="password"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {state.errors?.password && state.errors.password.length > 0 && (
                            <p className="text-red-500 text-sm">{state.errors.password[0]}</p>
                        )}
                    </div>
                </div>

                {/* Coluna da direita */}
                <div className="flex-1 flex flex-col gap-6">
                    <div>
                        <input
                            name="city"
                            placeholder="Cidade *"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {state.errors?.city && state.errors.city.length > 0 && (
                            <p className="text-red-500 text-sm">{state.errors.city[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-gray-500 block mb-2">DIAS DA SEMANA</label>
                        <div className="flex flex-wrap gap-4">
                            {daysOfWeek.map(day => (
                                <label key={day.value} className="flex items-center space-x-2">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="days"
                                            value={day.value}
                                            onChange={handleDayChange}
                                            className="h-5 w-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-sensedia-purple-primary checked:border-transparent focus:outline-none cursor-pointer peer"
                                        />
                                        <Check
                                            size={20}
                                            className="absolute inset-0 text-white hidden peer-checked:block pointer-events-none"
                                        />
                                    </div>
                                    <span>{day.label}</span>
                                </label>
                            ))}

                        </div>
                        {state.errors?.selectedDays && state.errors.selectedDays.length > 0 && (
                            <p className="text-red-500 text-sm">{state.errors.selectedDays[0]}</p>
                        )}

                        {selectedDays.map((day, index) => (
                            <input
                                key={index}
                                type="hidden"
                                name="selectedDays"
                                value={day}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center mt-8 space-x-4">
                <SubmitButton />
                <button
                    type="button"
                    className="text-sensedia-purple-primary font-semibold hover:underline cursor-pointer"
                    onClick={() => router.push('/user')}
                >
                    CANCELAR
                </button>
            </div>
        </form>
    )
}
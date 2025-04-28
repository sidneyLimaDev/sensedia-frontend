'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { bffUserService } from '@/services/bffUserService'
import { useRouter } from 'next/navigation'

const schema = z.object({
    username: z.string().min(1, 'Nome de usuário é obrigatório'),
    fullName: z.string().min(1, 'Nome completo é obrigatório'),
    email: z.string().email('E-mail inválido'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    days: z.array(z.string()).nonempty('Selecione pelo menos um dia')
});

type FormData = z.infer<typeof schema>

const daysOfWeek = [
    { label: 'Seg', value: 'Segunda' },
    { label: 'Ter', value: 'Terça' },
    { label: 'Qua', value: 'Quarta' },
    { label: 'Qui', value: 'Quinta' },
    { label: 'Sex', value: 'Sexta' },
    { label: 'Sab', value: 'Sábado' },
    { label: 'Dom', value: 'Domingo' },
]

export default function FormRegister() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            days: []
        }
    })

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true)
            setError(null)

            console.log("Dados do formulário antes de enviar:", data);
            const createdUser = await bffUserService.createUser(data);

            console.log('Usuário criado com sucesso:', createdUser);

            // Subistituir alert pelo Toast
            alert('Usuário criado com sucesso!');

            router.push('/login');
        } catch (error) {
            console.error('Erro ao criar usuário:', error);


            const errorMessage = error instanceof Error
                ? `Erro: ${error.message}`
                : 'Ocorreu um erro desconhecido ao criar o usuário';

            setError(errorMessage);

            // Subistitui alert pelo Toast
            alert(`Falha ao criar usuário: ${errorMessage}`);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 border rounded-lg max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-600 mb-6">REGISTRO</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Coluna da esquerda */}
                <div className="flex-1 flex flex-col gap-6">
                    <div>
                        <input
                            {...register('username')}
                            placeholder="Nome de usuário *"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register('fullName')}
                            placeholder="Nome completo *"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register('email')}
                            placeholder="E-mail *"
                            type="email"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                        <input
                            {...register('password')}
                            placeholder="Senha *"
                            type="password"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                </div>

                {/* Coluna da direita */}
                <div className="flex-1 flex flex-col gap-6">
                    <div>
                        <input
                            {...register('city')}
                            placeholder="Cidade *"
                            className="w-full bg-gray-100 p-3 border-b border-gray-400 focus:outline-none"
                        />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>

                    <div>
                        <label className="text-gray-500 block mb-2">DIAS DA SEMANA</label>
                        <div className="flex flex-wrap gap-4">
                            {daysOfWeek.map(day => (
                                <label key={day.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={day.value}
                                        {...register('days')}
                                        className="h-5 w-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-sensedia-purple-primary checked:border-transparent focus:outline-none cursor-pointer"
                                    />
                                    <span>{day.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.days && <p className="text-red-500 text-sm">{errors.days.message}</p>}
                    </div>
                </div>
            </div>

            <div className="flex items-center mt-8 space-x-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-sensedia-purple-primary text-white font-semibold py-3 px-8 rounded-full transition ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-sensedia-purple-secundary'
                        }`}
                >
                    {isLoading ? 'PROCESSANDO...' : 'REGISTRAR'}
                </button>
                <button
                    type="button"
                    className="text-sensedia-purple-primary font-semibold hover:underline"
                    onClick={() => router.push('/user')}
                    disabled={isLoading}
                >
                    CANCELAR
                </button>
            </div>
        </form>
    )
}
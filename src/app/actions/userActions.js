'use server'

import { z } from 'zod'
import { userService } from '@/services/userService'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

// Ordem dos dias da semana
const daysOfWeekOrder = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
]

// Validação do formulário com zod
const userSchema = z.object({
    username: z.string().min(1, 'Nome de usuário é obrigatório'),
    fullName: z.string().min(1, 'Nome completo é obrigatório'),
    email: z.string().email('E-mail inválido'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    selectedDays: z.array(z.string()).min(1, 'Selecione pelo menos um dia')
});

export async function createUser(prevState, formData) {
    const rawFormData = {
        username: formData.get('username'),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        city: formData.get('city'),
        password: formData.get('password'),
        selectedDays: formData.getAll('selectedDays'),
    }

    const validationResult = userSchema.safeParse(rawFormData);

    if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;

        return {
            success: false,
            message: 'Por favor, corrija os erros no formulário.',
            errors
        };
    }

    const validatedData = validationResult.data;

    try {
        // 1. Preparar os dados para a API principal
        const apiUserData = {
            email: validatedData.email,
            name: validatedData.fullName,
            password: validatedData.password
        };

        console.log('createUser - Enviando para API principal:', apiUserData);

        // 2. Criar o usuário na API principal
        let createdUser;
        try {
            const response = await userService.create(apiUserData);
            createdUser = response;
            console.log('createUser - Usuário criado na API principal:', createdUser);
        } catch (apiError) {
            console.error('createUser - Erro na API principal:', apiError);
            return {
                success: false,
                message: `Erro ao criar usuário na API principal: ${apiError instanceof Error ? apiError.message : 'Erro desconhecido'}`,
                errors: {}
            };
        }

        // Verificar se o usuário foi criado corretamente
        if (!createdUser || !createdUser.id) {
            console.error('createUser - Resposta inválida da API:', createdUser);
            return {
                success: false,
                message: 'API retornou usuário sem ID válido',
                errors: {}
            };
        }

        // 3. Preparar os dados para o Supabase
        const formattedDays = validatedData.selectedDays.sort((a, b) =>
            daysOfWeekOrder.indexOf(a) - daysOfWeekOrder.indexOf(b)
        );

        const supabaseData = {
            user_id: createdUser.id,
            days_of_week: formattedDays,
            city: validatedData.city,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            blocked: false
        };

        console.log('createUser - Enviando para Supabase:', supabaseData);

        // 4. Salvar os dados adicionais no Supabase
        try {
            const { error } = await supabase
                .from('user_data')
                .insert([supabaseData]);

            if (error) {
                console.error(`createUser - Erro no Supabase:`, error);

                // Se falhar no Supabase, tenta reverter criação do usuário na API principal
                try {
                    await userService.delete(createdUser.id);
                    console.log(`createUser - Usuário ${createdUser.id} excluído após erro no Supabase`);
                } catch (deleteError) {
                    console.error(`createUser - Erro ao excluir usuário após falha no Supabase:`, deleteError);
                }

                return {
                    success: false,
                    message: `Erro ao salvar dados adicionais: ${error.message}`,
                    errors: {}
                };
            }

            console.log('createUser - Dados salvos no Supabase com sucesso');
        } catch (supabaseError) {
            return {
                success: false,
                message: supabaseError instanceof Error ? supabaseError.message : 'Erro desconhecido ao salvar no Supabase',
                errors: {}
            };
        }

        // 5. Dados completos do usuário
        const completeUserData = {
            ...createdUser,
            city: validatedData.city,
            days_of_week: formattedDays,
            username: validatedData.username,
            posts: [],
            albums: []
        };

        // 6. Em vez de LocalStorage (que não existe no servidor), usar cookies
        try {
            cookies().set('user_id', createdUser.id, {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7
            });

            console.log('createUser - ID do usuário salvo nos cookies');
        } catch (cookieError) {
            console.error('createUser - Erro ao salvar nos cookies:', cookieError);
            // Não falhar a operação se os cookies falharem
        }

        // 7. Retornar sucesso
        return {
            success: true,
            message: 'Usuário criado com sucesso',
            errors: {},
            user: completeUserData
        };

    } catch (error) {
        console.error('createUser - Erro completo:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
            errors: {}
        };
    }
}
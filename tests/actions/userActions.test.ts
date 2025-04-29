/**
 * @jest/globals
 * @jest-environment node
 */

import { userService } from '@/services/userService';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { createUser } from '@/app/actions/userActions';

// Mocks
jest.mock('@/services/userService', () => ({
    userService: {
        create: jest.fn(),
        delete: jest.fn()
    }
}));

jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn().mockReturnThis()
    }
}));

jest.mock('next/headers', () => ({
    cookies: jest.fn().mockReturnValue({
        set: jest.fn()
    })
}));

// Helper para criar FormData para testes
function createMockFormData(data) {
    const formData = {
        get: jest.fn(key => data[key]),
        getAll: jest.fn(key => Array.isArray(data[key]) ? data[key] : [data[key]])
    };
    return formData;
}

describe('createUser action', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar erros quando dados do formulário são inválidos', async () => {
        // Dados inválidos (email incorreto, senha muito curta)
        const mockFormData = createMockFormData({
            username: 'testuser',
            fullName: 'Test User',
            email: 'invalid-email',
            city: 'Test City',
            password: '123',
            selectedDays: ['Segunda', 'Quarta']
        });

        const result = await createUser({}, mockFormData);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Por favor, corrija os erros no formulário.');
        expect(result.errors).toHaveProperty('email');
        expect(result.errors).toHaveProperty('password');

        // Verificar que os serviços não foram chamados
        expect(userService.create).not.toHaveBeenCalled();
        expect(supabase.from).not.toHaveBeenCalled();
    });

    it('deve criar usuário com sucesso quando dados são válidos', async () => {
        // Dados válidos
        const mockFormData = createMockFormData({
            username: 'testuser',
            fullName: 'Test User',
            email: 'test@example.com',
            city: 'Test City',
            password: 'password123',
            selectedDays: ['Segunda', 'Quarta', 'Sexta']
        });

        // Mock da resposta da API de usuário
        const mockUser = { id: 'user123', name: 'Test User', email: 'test@example.com' };
        userService.create.mockResolvedValue(mockUser);

        // Mock da resposta do Supabase
        const insertMock = jest.fn().mockResolvedValue({ error: null });
        supabase.from.mockReturnValue({
            insert: insertMock
        });

        const result = await createUser({}, mockFormData);

        // Verificações de sucesso
        expect(result.success).toBe(true);
        expect(result.message).toBe('Usuário criado com sucesso');
        expect(result.user).toHaveProperty('id', 'user123');
        expect(result.user.city).toBe('Test City');
        expect(result.user.days_of_week).toEqual(['Segunda', 'Quarta', 'Sexta']);

        // Verificar chamadas para os serviços
        expect(userService.create).toHaveBeenCalledWith({
            email: 'test@example.com',
            name: 'Test User',
            password: 'password123'
        });

        expect(supabase.from).toHaveBeenCalledWith('user_data');
        expect(cookies().set).toHaveBeenCalledWith('user_id', 'user123', expect.any(Object));
    });

    it('deve ordenar os dias da semana corretamente', async () => {
        // Dados com dias fora de ordem
        const mockFormData = createMockFormData({
            username: 'testuser',
            fullName: 'Test User',
            email: 'test@example.com',
            city: 'Test City',
            password: 'password123',
            selectedDays: ['Domingo', 'Quarta', 'Segunda']
        });

        // Mock da resposta da API de usuário
        const mockUser = { id: 'user123', name: 'Test User', email: 'test@example.com' };
        userService.create.mockResolvedValue(mockUser);

        // Mock da resposta do Supabase
        const insertMock = jest.fn().mockResolvedValue({ error: null });
        supabase.from.mockReturnValue({
            insert: insertMock
        });

        const result = await createUser({}, mockFormData);

        // Verificar a ordenação dos dias da semana (Segunda, Quarta, Domingo)
        expect(result.user.days_of_week).toEqual(['Segunda', 'Quarta', 'Domingo']);

        // Verificar dados enviados para o Supabase
        expect(supabase.from).toHaveBeenCalledWith('user_data');
        expect(insertMock).toHaveBeenCalledWith([
            expect.objectContaining({
                days_of_week: ['Segunda', 'Quarta', 'Domingo']
            })
        ]);
    });

    it('deve tratar erro na API principal', async () => {
        const mockFormData = createMockFormData({
            username: 'testuser',
            fullName: 'Test User',
            email: 'test@example.com',
            city: 'Test City',
            password: 'password123',
            selectedDays: ['Segunda']
        });

        // Simular erro na API principal
        const apiError = new Error('Falha na API principal');
        userService.create.mockRejectedValue(apiError);

        const result = await createUser({}, mockFormData);

        expect(result.success).toBe(false);
        expect(result.message).toContain('Erro ao criar usuário na API principal');
        expect(supabase.from).not.toHaveBeenCalled();
        expect(cookies().set).not.toHaveBeenCalled();
    });

    it('deve tratar erro no Supabase e tentar reverter criação do usuário', async () => {
        const mockFormData = createMockFormData({
            username: 'testuser',
            fullName: 'Test User',
            email: 'test@example.com',
            city: 'Test City',
            password: 'password123',
            selectedDays: ['Segunda']
        });

        // Mock da resposta da API de usuário
        const mockUser = { id: 'user123', name: 'Test User', email: 'test@example.com' };
        userService.create.mockResolvedValue(mockUser);

        // Simular erro no Supabase
        const insertMock = jest.fn().mockResolvedValue({ error: { message: 'Erro no Supabase' } });
        supabase.from.mockReturnValue({
            insert: insertMock
        });

        const result = await createUser({}, mockFormData);

        expect(result.success).toBe(false);
        expect(result.message).toContain('Erro ao salvar dados adicionais');

        // Verificar que a exclusão do usuário foi tentada
        expect(userService.delete).toHaveBeenCalledWith('user123');
        expect(cookies().set).not.toHaveBeenCalled();
    });

    it('deve lidar com erro nos cookies sem falhar a operação', async () => {
        const mockFormData = createMockFormData({
            username: 'testuser',
            fullName: 'Test User',
            email: 'test@example.com',
            city: 'Test City',
            password: 'password123',
            selectedDays: ['Segunda']
        });

        // Mock da resposta da API de usuário
        const mockUser = { id: 'user123', name: 'Test User', email: 'test@example.com' };
        userService.create.mockResolvedValue(mockUser);

        // Mock da resposta do Supabase
        const insertMock = jest.fn().mockResolvedValue({ error: null });
        supabase.from.mockReturnValue({
            insert: insertMock
        });

        // Simular erro ao definir cookies
        const cookiesInstance = {
            set: jest.fn().mockImplementation(() => {
                throw new Error('Erro ao definir cookie');
            })
        };
        cookies.mockReturnValue(cookiesInstance);

        const result = await createUser({}, mockFormData);

        // A operação deve ter sucesso mesmo com falha nos cookies
        expect(result.success).toBe(true);
        expect(result.message).toBe('Usuário criado com sucesso');
    });

    it('deve retornar erro se o usuário criado não tiver ID válido', async () => {
        const mockFormData = createMockFormData({
            username: 'testuser',
            fullName: 'Test User',
            email: 'test@example.com',
            city: 'Test City',
            password: 'password123',
            selectedDays: ['Segunda']
        });

        // API retorna resposta sem ID
        userService.create.mockResolvedValue({ name: 'Test User', email: 'test@example.com' });

        const result = await createUser({}, mockFormData);

        expect(result.success).toBe(false);
        expect(result.message).toBe('API retornou usuário sem ID válido');
        expect(supabase.from).not.toHaveBeenCalled();
    });
});
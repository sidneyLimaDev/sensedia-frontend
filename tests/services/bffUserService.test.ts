import { bffUserService } from '@/services/bffUserService';
import { userService } from '@/services/userService';
import { postService } from '@/services/postService';
import { albumService } from '@/services/albumService';
import { supabase } from '@/lib/supabase';

jest.mock('@/services/userService');
jest.mock('@/services/postService');
jest.mock('@/services/albumService');
jest.mock('@/lib/supabase');

describe('bffUserService.getUserById', () => {
    const fakeUser = { id: 'user-123', name: 'Sid', email: 'sid@example.com' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar os dados completos do usuário se não estiver bloqueado', async () => {
        (userService.getById as jest.Mock).mockResolvedValue(fakeUser);
        (supabase.from as jest.Mock).mockReturnValue({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({
                        data: { city: 'Recife', days_of_week: ['Segunda', 'Sexta'], blocked: false },
                        error: null,
                    }),
                }),
            }),
        });
        (postService.getPostsByUserId as jest.Mock).mockResolvedValue([]);
        (albumService.getAlbumsByUserId as jest.Mock).mockResolvedValue([]);

        const result = await bffUserService.getUserById('user-123');

        expect(result).toEqual({
            ...fakeUser,
            city: 'Recife',
            days_of_week: ['Segunda', 'Sexta'],
            posts: [],
            albums: [],
        });
    });

    it('deve retornar null se o usuário estiver bloqueado', async () => {
        (userService.getById as jest.Mock).mockResolvedValue(fakeUser);
        (supabase.from as jest.Mock).mockReturnValue({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({
                        data: { blocked: true },
                        error: null,
                    }),
                }),
            }),
        });

        const result = await bffUserService.getUserById('user-123');
        expect(result).toBeNull();
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
        (userService.getById as jest.Mock).mockResolvedValue(null);

        const result = await bffUserService.getUserById('user-123');
        expect(result).toBeNull();
    });
});
describe('bffUserService.updateUserDaysOfWeek', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve atualizar os dias da semana de um usuário com sucesso', async () => {
        const userId = 'user-123';
        const selectedDays = ['Segunda', 'Quarta', 'Sexta'];

        const mockEq = jest.fn().mockResolvedValue({ error: null });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

        (supabase.from as jest.Mock).mockImplementation(mockFrom);

        await bffUserService.updateUserDaysOfWeek(userId, selectedDays);

        expect(mockFrom).toHaveBeenCalledWith('user_data');

        expect(mockUpdate).toHaveBeenCalledWith({ days_of_week: ['Segunda', 'Quarta', 'Sexta'] });

        expect(mockEq).toHaveBeenCalledWith('user_id', userId);
    });

    it('deve lidar corretamente com erros ao atualizar os dias da semana', async () => {
        const userId = 'user-123';
        const selectedDays = ['Terça', 'Quinta'];
        const errorMsg = 'Erro ao atualizar dados';

        console.error = jest.fn();

        const mockEq = jest.fn().mockResolvedValue({ error: { message: errorMsg } });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });


        (supabase.from as jest.Mock).mockImplementation(mockFrom);

        await bffUserService.updateUserDaysOfWeek(userId, selectedDays);

        expect(console.error).toHaveBeenCalledWith(
            `Erro ao atualizar dias da semana para o usuário ${userId}:`,
            { message: errorMsg }
        );
    });
});
describe('bffUserService.blockUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve bloquear um usuário com sucesso', async () => {
        const userId = 'user-123';

        // Criando mocks para cada método na cadeia
        const mockEq = jest.fn().mockResolvedValue({ error: null });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

        // Substituindo o mock do supabase.from
        (supabase.from as jest.Mock).mockImplementation(mockFrom);

        await bffUserService.blockUser(userId);

        // Verifica se o supabase.from foi chamado com o parâmetro correto
        expect(mockFrom).toHaveBeenCalledWith('user_data');

        // Verifica se o método update foi chamado com blocked: true
        expect(mockUpdate).toHaveBeenCalledWith({ blocked: true });

        // Verifica se o método eq foi chamado com o userId correto
        expect(mockEq).toHaveBeenCalledWith('user_id', userId);
    });

    it('deve lidar corretamente com erros ao bloquear um usuário', async () => {
        const userId = 'user-123';
        const errorMsg = 'Erro ao bloquear usuário';

        // Mock do console.error para verificarmos se foi chamado
        console.error = jest.fn();

        // Criando mocks para cada método na cadeia
        const mockEq = jest.fn().mockResolvedValue({ error: { message: errorMsg } });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

        // Substituindo o mock do supabase.from
        (supabase.from as jest.Mock).mockImplementation(mockFrom);

        await expect(bffUserService.blockUser(userId)).resolves.not.toThrow();

        // Verifica se o console.error foi chamado com a mensagem de erro
        expect(console.error).toHaveBeenCalledWith(
            `Erro ao bloquear usuário ${userId}:`,
            { message: errorMsg }
        );
    });

    it('deve propagar exceção em caso de erro não relacionado ao Supabase', async () => {
        const userId = 'user-123';
        const error = new Error('Erro inesperado');

        // Mock do console.error para verificarmos se foi chamado
        console.error = jest.fn();

        // Mock do retorno do supabase com exceção
        (supabase.from as jest.Mock).mockImplementation(() => {
            throw error;
        });

        await expect(bffUserService.blockUser(userId)).rejects.toThrow('Erro inesperado');

        // Verifica se o console.error foi chamado com a mensagem de erro
        expect(console.error).toHaveBeenCalledWith(
            `Erro ao bloquear o usuário ${userId}:`,
            error
        );
    });
});
describe('bffUserService.createUser', () => {
    const mockFormData = {
        email: 'user@example.com',
        fullName: 'Usuário Teste',
        password: 'senha123',
        username: 'usuarioteste',
        city: 'São Paulo',
        days: ['Segunda', 'Quarta', 'Sexta']
    };

    const mockCreatedUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Usuário Teste'
    };

    beforeEach(() => {
        jest.clearAllMocks();

        const mockLocalStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
            length: 0,
            key: jest.fn()
        };

        Object.defineProperty(global, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });

        console.error = jest.fn();
    });

    it('deve criar um usuário com sucesso', async () => {
        (userService.create as jest.Mock).mockResolvedValue(mockCreatedUser);

        const mockInsert = jest.fn().mockResolvedValue({ error: null });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        (supabase.from as jest.Mock).mockImplementation(mockFrom);

        const result = await bffUserService.createUser(mockFormData);

        expect(userService.create).toHaveBeenCalledWith({
            email: mockFormData.email,
            name: mockFormData.fullName,
            password: mockFormData.password
        });

        expect(mockFrom).toHaveBeenCalledWith('user_data');

        expect(mockInsert).toHaveBeenCalledWith([
            expect.objectContaining({
                user_id: mockCreatedUser.id,
                days_of_week: mockFormData.days,
                city: mockFormData.city,
                blocked: false
            })
        ]);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'user',
            JSON.stringify({
                ...mockCreatedUser,
                city: mockFormData.city,
                days_of_week: mockFormData.days,
                username: mockFormData.username,
                posts: [],
                albums: []
            })
        );


        expect(result).toEqual({
            ...mockCreatedUser,
            city: mockFormData.city,
            days_of_week: mockFormData.days,
            username: mockFormData.username,
            posts: [],
            albums: []
        });
    });

    it('deve lançar um erro se a criação na API principal falhar', async () => {
        const apiError = new Error('Erro na API principal');


        (userService.create as jest.Mock).mockRejectedValue(apiError);

        await expect(bffUserService.createUser(mockFormData)).rejects.toThrow(
            'Erro ao criar usuário na API principal: Erro na API principal'
        );


        expect(console.error).toHaveBeenCalledWith(
            'bffUserService.createUser - Erro na API principal:',
            apiError
        );
    });

    it('deve tentar excluir o usuário se falhar ao salvar no Supabase', async () => {
        (userService.create as jest.Mock).mockResolvedValue(mockCreatedUser);

        (userService.delete as jest.Mock).mockResolvedValue(undefined);

        const supabaseError = { message: 'Erro no Supabase' };
        const mockInsert = jest.fn().mockResolvedValue({ error: supabaseError });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        (supabase.from as jest.Mock).mockImplementation(mockFrom);

        await expect(bffUserService.createUser(mockFormData)).rejects.toThrow(
            'Erro ao salvar dados adicionais: Erro no Supabase'
        );

        expect(userService.delete).toHaveBeenCalledWith(mockCreatedUser.id);

        expect(console.error).toHaveBeenCalledWith(
            'bffUserService.createUser - Erro no Supabase:',
            supabaseError
        );
    });

    it('deve lidar com erro ao salvar no localStorage', async () => {
        (userService.create as jest.Mock).mockResolvedValue(mockCreatedUser);


        const mockInsert = jest.fn().mockResolvedValue({ error: null });
        const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

        (supabase.from as jest.Mock).mockImplementation(mockFrom);

        const storageError = new Error('Erro ao salvar no localStorage');
        (localStorage.setItem as jest.Mock).mockImplementation(() => {
            throw storageError;
        });

        const result = await bffUserService.createUser(mockFormData);


        expect(console.error).toHaveBeenCalledWith(
            'bffUserService.createUser - Erro ao salvar no LocalStorage:',
            storageError
        );

        expect(result).toEqual({
            ...mockCreatedUser,
            city: mockFormData.city,
            days_of_week: mockFormData.days,
            username: mockFormData.username,
            posts: [],
            albums: []
        });
    });

    it('deve lançar erro se o usuário criado na API não tiver ID válido', async () => {
        (userService.create as jest.Mock).mockResolvedValue({
            email: 'user@example.com',
            name: 'Usuário Teste'
        });

        await expect(bffUserService.createUser(mockFormData)).rejects.toThrow(
            'API retornou usuário sem ID válido'
        );

        expect(console.error).toHaveBeenCalledWith(
            'bffUserService.createUser - Resposta inválida da API:',
            {
                email: 'user@example.com',
                name: 'Usuário Teste'
            }
        );
    });
});
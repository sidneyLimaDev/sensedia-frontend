import { userService } from './userService'; // Importando o serviço do backend
import { supabase } from '@/lib/supabase'; // Conexão com o Supabase
import { User } from '@/app/types/user';

const daysOfWeekOrder = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const getRandomDaysOfWeek = () => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
    const randomSelectionType = Math.random();
    
    if (randomSelectionType < 0.2) {
      return ['Todos'];
    } else if (randomSelectionType < 0.4) {
      return ['Fim de semana'];
    } else {
      const numberOfDays = Math.floor(Math.random() * 6) + 1;
      const selectedDays: string[] = [];
  
      while (selectedDays.length < numberOfDays) {
        const randomDay = days[Math.floor(Math.random() * days.length)];
        if (!selectedDays.includes(randomDay)) {
          selectedDays.push(randomDay);
        }
      }
  
      // Ordenar os dias na ordem correta
      const daysOfWeekOrder = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      return selectedDays.sort((a, b) => daysOfWeekOrder.indexOf(a) - daysOfWeekOrder.indexOf(b));
    }
  };

const getRandomCity = () => {
  const cities = ['São Paulo', 'Recife', 'Rio de Janeiro', 'Casmbuí'];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  return randomCity;
};

const formatDaysForUser = (selectedDays: string[]): string[] => {
    return selectedDays.sort((a, b) => daysOfWeekOrder.indexOf(a) - daysOfWeekOrder.indexOf(b));
  };

  
export const bffUserService = {
  // Função para pegar dados de todos os usuários
  async getAllUsers(): Promise<Array<User & { city: string; days_of_week: string[] }>> {
    // 1. Obter todos os usuários do backend
    const allUsers = await userService.getAll();

    // 2. Obter dados adicionais (cidade e dias da semana) do Supabase para cada usuário
    const usersWithAdditionalData = await Promise.all(
      allUsers.map(async (user) => {
        // Consultar dados adicionais do Supabase
        const { data, error } = await supabase
          .from('user_data')
          .select('city, days_of_week')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error(`Erro ao consultar dados no Supabase para o usuário ${user.id}:`, error);
        }

        // Caso não tenha dados no banco, gera dados aleatórios e salvamos no banco
        if (!data) {
          const days_of_week = getRandomDaysOfWeek();
          const city = getRandomCity();

          // Inserir no banco de dados
          const { error: insertError } = await supabase
            .from('user_data')
            .insert([{ user_id: user.id, days_of_week, city, created_at: new Date().toISOString() }]);

          if (insertError) {
            console.error(`Erro ao inserir dados no Supabase para o usuário ${user.id}:`, insertError);
          }

          // Retornar dados do usuário com informações adicionais
          return { ...user, city, days_of_week };
        }

        // Caso o usuário já tenha dados, retorna tudo junto
        return { ...user, city: data.city, days_of_week: data.days_of_week };
      })
    );

    return usersWithAdditionalData;
  },

  // Função para pegar dados de um único usuário pelo id
  async getUserById(userId: string): Promise<User & { city: string; days_of_week: string[] } | null> {
    // 1. Obter o usuário do backend
    const user = await userService.getById(userId);

    if (!user) {
      console.error(`Usuário com ID ${userId} não encontrado`);
      return null;
    }

    // 2. Consultar dados adicionais (cidade e dias da semana) do Supabase para o usuário
    const { data, error } = await supabase
      .from('user_data')
      .select('city, days_of_week')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(`Erro ao consultar dados no Supabase para o usuário ${userId}:`, error);
      return null;
    }

    // Caso não tenha dados no banco, gera dados aleatórios e salva no banco
    if (!data) {
      const days_of_week = getRandomDaysOfWeek();
      const city = getRandomCity();

      // Inserir no banco de dados
      const { error: insertError } = await supabase
        .from('user_data')
        .insert([{ user_id: user.id, days_of_week, city, created_at: new Date().toISOString() }]);

      if (insertError) {
        console.error(`Erro ao inserir dados no Supabase para o usuário ${user.id}:`, insertError);
        return null;
      }

      // Retornar dados do usuário com informações adicionais
      return { ...user, city, days_of_week };
    }

    // Caso o usuário já tenha dados, aplica a formatação dos dias da semana
    const formattedDays = formatDaysForUser(data.days_of_week);

    return { ...user, city: data.city, days_of_week: formattedDays };
  },

  // Função para atualizar os dias da semana de um usuário
  async updateUserDaysOfWeek(userId: string, selectedDays: string[]): Promise<void> {
    const formattedDays = formatDaysForUser(selectedDays);

    const { error } = await supabase
      .from('user_data')
      .update({ days_of_week: formattedDays })
      .eq('user_id', userId);

    if (error) {
      console.error(`Erro ao atualizar dias da semana para o usuário ${userId}:`, error);
    }
  }
};

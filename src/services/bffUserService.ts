import { userService } from './userService';
import { supabase } from '@/lib/supabase';
import { User } from '@/app/types/user';
import { postService } from './postService';
import { albumService } from './albumService';
import { Post } from '@/app/types/post';
import { Album } from '@/app/types/album';

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

    return selectedDays.sort((a, b) => daysOfWeekOrder.indexOf(a) - daysOfWeekOrder.indexOf(b));
  }
};

const getRandomCity = () => {
  const cities = ['São Paulo', 'Recife', 'Rio de Janeiro', 'Casmbuí'];
  return cities[Math.floor(Math.random() * cities.length)];
};

const formatDaysForUser = (selectedDays: string[]): string[] => {
  return selectedDays.sort((a, b) => daysOfWeekOrder.indexOf(a) - daysOfWeekOrder.indexOf(b));
};

export const bffUserService = {
  // Função para pegar dados de todos os usuários
  async getAllUsers(): Promise<Array<User & { city: string; days_of_week: string[]; posts: Post[]; albums: Album[] }>> {
    const allUsers = await userService.getAll();

    const usersWithAdditionalData = await Promise.all(
      allUsers.map(async (user) => {
        const { data, error } = await supabase
          .from('user_data')
          .select('city, days_of_week, blocked')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error(`Erro ao consultar dados no Supabase para o usuário ${user.id}:`, error);
        }

        // Se o usuário está bloqueado, ignora ele
        if (data?.blocked) {
          return null;
        }

        if (!data) {
          const days_of_week = getRandomDaysOfWeek();
          const city = getRandomCity();

          const { error: insertError } = await supabase
            .from('user_data')
            .insert([{ user_id: user.id, days_of_week, city, created_at: new Date().toISOString(), blocked: false }]);

          if (insertError) {
            console.error(`Erro ao inserir dados no Supabase para o usuário ${user.id}:`, insertError);
          }

          // Carregar posts e álbuns
          const posts = await postService.getPostsByUserId(user.id);
          const albums = await albumService.getAlbumsByUserId(user.id);

          return { ...user, city, days_of_week, posts, albums };
        }

        const formattedDays = formatDaysForUser(data.days_of_week);

        // Carregar posts e álbuns
        const posts = await postService.getPostsByUserId(user.id);
        const albums = await albumService.getAlbumsByUserId(user.id);

        return { ...user, city: data.city, days_of_week: formattedDays, posts, albums };
      })
    );

    return usersWithAdditionalData.filter((user) => user !== null) as Array<User & { city: string; days_of_week: string[]; posts: Post[]; albums: Album[] }>;
  },

  // Função para pegar dados de um único usuário pelo id
  async getUserById(userId: string): Promise<User & { city: string; days_of_week: string[]; posts: Post[]; albums: Album[] } | null> {
    const user = await userService.getById(userId);

    if (!user) {
      console.error(`Usuário com ID ${userId} não encontrado`);
      return null;
    }

    const { data, error } = await supabase
      .from('user_data')
      .select('city, days_of_week, blocked')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(`Erro ao consultar dados no Supabase para o usuário ${userId}:`, error);
      return null;
    }

    if (data?.blocked) {
      return null; // Se o usuário estiver bloqueado, não retorna nada
    }

    if (!data) {
      const days_of_week = getRandomDaysOfWeek();
      const city = getRandomCity();

      const { error: insertError } = await supabase
        .from('user_data')
        .insert([{ user_id: user.id, days_of_week, city, created_at: new Date().toISOString(), blocked: false }]);

      if (insertError) {
        console.error(`Erro ao inserir dados no Supabase para o usuário ${user.id}:`, insertError);
        return null;
      }

      // Carregar posts e álbuns
      const posts = await postService.getPostsByUserId(user.id);
      const albums = await albumService.getAlbumsByUserId(user.id);

      return { ...user, city, days_of_week, posts, albums };
    }

    const formattedDays = formatDaysForUser(data.days_of_week);

    // Carregar posts e álbuns
    const posts = await postService.getPostsByUserId(user.id);
    const albums = await albumService.getAlbumsByUserId(user.id);

    return { ...user, city: data.city, days_of_week: formattedDays, posts, albums };
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
  },

  // Função para bloquear um usuário
  async blockUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_data')
        .update({ blocked: true })
        .eq('user_id', userId);

      if (error) {
        console.error(`Erro ao bloquear usuário ${userId}:`, error);
      }
    } catch (error) {
      console.error(`Erro ao bloquear o usuário ${userId}:`, error);
      throw error;
    }
  }
};

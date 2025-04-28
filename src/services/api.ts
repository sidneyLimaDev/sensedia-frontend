import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptador de respostas
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                console.error('Não autorizado.');
            } else if (status >= 500) {
                console.error('Erro no servidor. Tente novamente mais tarde.');
            }
        } else if (error.request) {
            console.error('Sem resposta do servidor.');
        } else {
            console.error('Erro ao configurar requisição:', error.message);
        }
        return Promise.reject(error);
    }
);

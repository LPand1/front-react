import axios from 'axios'; // Importa a biblioteca axios para fazer requisições HTTP de páginas externas

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Define a URL base para as requisições, que é obtida de uma variável de ambiente
    timeout: 10000,
    headers: {
        Accept: "application/json", // Define o cabeçalho para aceitar respostas em formato JSON
    },
});

export function getErrorMessage(error) {
    if (!axios.isAxiosError(error)) {
        return "Ocorreu um erro inesperado."; // Retorna uma mensagem de erro genérica se o erro não for do tipo Axios
    }

    const status = error.response?.status; // Obtém o status da resposta do erro, se disponível
    const data = error.response?.data; // Obtém os dados da resposta do erro, se disponíveis

    // sem resposta ou fora do ar

    if (!status || [502, 503, 504].includes(status)) {
        return "O servidor está fora do ar. Tente novamente mais tarde."; // Retorna uma mensagem de erro específica se o servidor estiver fora do ar
    }

    if (status === 422 && data?.errors) {
        return Object.values(data.errors).flat()[0]; // Retorna uma mensagem de erro detalhada se houver erros de validação
    }

    return data?.message || "Ocorreu um erro inesperado."; // Retorna a mensagem de erro da resposta ou uma mensagem genérica se não houver (${status}) 
}
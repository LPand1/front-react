import { api } from './api';

// Laravel devolve { data: {...} } quando usa o controller usa JsonResource. Se devolver o modelo direto, usamos o próprio corpo da resposta.

const unwrap = (response) => response.data?.data ?? response.data;

export async function listTasks({ signal } = {}) {
    const response = (await api.get('/tasks', { signal }));
} 
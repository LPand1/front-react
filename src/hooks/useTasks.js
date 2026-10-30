import { useState, useEffect } from "react";
import { listTasks } from "../services/tasks";
import axios from "axios";
import { getErrorMessage } from "../services/api";

export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState('loading');
    const [loadError, setLoadError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0); // toda vez que fizer requisição para o servidor aumenta esse número para não fazer cacheamento das requisições.

    useEffect(() => {
        const controller = new AbortController(); // API do Fetch que serve para cancelar uma requisição assíncrona.

        listTasks({ signal: controller.signal })
            .then((data) => {
                setTasks(data);
                setStatus('success');
            }) 
            .catch((error) => {
                if (axios.isCancel(error)) {
                    return;
                }
                setLoadError(getErrorMessage(error));
                setStatus('error');
            });

            return () => controller.abort(); // cancela a requisição se o componente for desmontado antes de terminar a requisição.
        }, [reloadKey]); // toda vez que o reloadKey mudar, o useEffect é chamado novamente.

    const reload = () => {
        setStatus('loading');
        setReloadKey(prevKey => prevKey + 1); // aumenta o reloadKey para disparar o useEffect novamente.
    }

    return { tasks, status, loadError, reload };
}
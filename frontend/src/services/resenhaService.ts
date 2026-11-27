import api from "./api";

import type {
    Resenha,
    ResenhaRequest
} from "../types/Resenha";

export async function listarResenhas(): Promise<Resenha[]> {

    const response = await api.get<Resenha[]>("/resenhas");

    return response.data;
}

export async function buscarResenha(
    id: number
): Promise<Resenha> {

    const response = await api.get<Resenha>(`/resenhas/${id}`);

    return response.data;
}

export async function cadastrarResenha(
    dados: ResenhaRequest
): Promise<Resenha> {

    const response = await api.post<Resenha>(
        "/resenhas",
        dados
    );

    return response.data;
}

export async function atualizarResenha(
    id: number,
    dados: ResenhaRequest
): Promise<Resenha> {

    const response = await api.put<Resenha>(
        `/resenhas/${id}`,
        dados
    );

    return response.data;
}

export async function excluirResenha(
    id: number
): Promise<void> {

    await api.delete(`/resenhas/${id}`);
}
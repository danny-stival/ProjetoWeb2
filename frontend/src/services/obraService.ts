import api from "./api";
import type { Obra, ObraRequest } from "../types/Obra";


export async function listarObras(): Promise<Obra[]> {
    const response = await api.get<Obra[]>("/obras");
    return response.data;
}

export async function buscarObra(id: number): Promise<Obra> {
    const response = await api.get<Obra>(`/obras/${id}`);
    return response.data;
}

export async function cadastrarObra(dados: ObraRequest): Promise<Obra> {
    const response = await api.post<Obra>("/obras", dados);
    return response.data;
}
export async function atualizarObra(
    id: number,
    dados: ObraRequest
): Promise<Obra> {
    const response = await api.put<Obra>(`/obras/${id}`, dados);
    return response.data;
}


export async function excluirObra(id: number): Promise<void> {
    await api.delete(`/obras/${id}`);
}

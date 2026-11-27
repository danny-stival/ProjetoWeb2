export interface Resenha {
    id: number;
    obraId: number;
    obraTitulo: string;
    titulo: string;
    comentario: string;
    nota: number;
    dataCriacao: string;
}

export interface ResenhaRequest {
    obraId: number;
    titulo: string;
    comentario: string;
    nota: number;
}
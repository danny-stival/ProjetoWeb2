
import api from "./api";

// Dados p login
export interface LoginRequest {
    username: string;
    senha: string;
}

// Depois
export interface LoginResponse {
    token: string;
    tipo: string;
    username: string;
}
export interface CadastroRequest {
    nome: string;
    username: string;
    email: string;
    senha: string;
}

export async function login(dados: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", dados);

    localStorage.setItem("token", response.data.token);

    return response.data;
}

export async function cadastrar(dados: CadastroRequest) {
    const response = await api.post("/auth/cadastro", dados);

    return response.data;
}

export function logout() {
    localStorage.removeItem("token");
}

export function estaAutenticado(): boolean {
    return !!localStorage.getItem("token");
}

import axios from "axios";
import api from "./api";

import type {
    Perfil,
    PerfilRequest,
    AlterarUsernameRequest,
    AlterarSenhaRequest,
    ExcluirContaRequest,
    EstatisticasPerfil
} from "../types/Perfil";

export async function consultarPerfil(): Promise<Perfil> {

    const response = await api.get<Perfil>(
        "/usuarios/me"
    );

    return response.data;
}

export async function atualizarPerfil(
    dados: PerfilRequest
): Promise<Perfil> {

    const response = await api.put<Perfil>(
        "/usuarios/me",
        dados
    );

    return response.data;
}

export async function alterarUsername(
    dados: AlterarUsernameRequest
): Promise<void> {

    await api.put(
        "/usuarios/me/username",
        dados
    );
}

export async function alterarSenha(
    dados: AlterarSenhaRequest
): Promise<void> {

    await api.put(
        "/usuarios/me/senha",
        dados
    );
}

export async function consultarFoto(): Promise<Blob | null> {

    try {

        const response = await api.get<Blob>(
            "/usuarios/me/foto",
            {
                responseType: "blob"
            }
        );

        return response.data;

    } catch (erro) {

        if (
            axios.isAxiosError(erro) &&
            erro.response?.status === 404
        ) {
            return null;
        }

        throw erro;
    }
}

export async function atualizarFoto(
    arquivo: File
): Promise<void> {

    const formData = new FormData();

    formData.append("arquivo", arquivo);

    await api.put(
        "/usuarios/me/foto",
        formData
    );
}

export async function removerFoto(): Promise<void> {

    await api.delete(
        "/usuarios/me/foto"
    );
}
export async function consultarEstatisticas():
    Promise<EstatisticasPerfil> {

    const response = await api.get<EstatisticasPerfil>(
        "/usuarios/me/estatisticas"
    );

    return response.data;
}

export async function excluirConta(
    dados: ExcluirContaRequest
): Promise<void> {

    await api.delete(
        "/usuarios/me",
        {
            data: dados
        }
    );
}

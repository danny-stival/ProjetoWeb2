export interface Perfil {
    id: number;
    nome: string;
    username: string;
    email: string;
}

export interface PerfilRequest {
    nome: string;
    email: string;
}

export interface AlterarUsernameRequest {
    novoUsername: string;
    senhaAtual: string;
}

export interface AlterarSenhaRequest {
    senhaAtual: string;
    novaSenha: string;
    confirmarSenha: string;
}

export interface ExcluirContaRequest {
    senhaAtual: string;
    confirmacao: string;
}

export interface EstatisticasPerfil {
    totalObras: number;

    concluidas: number;
    emAndamento: number;
    listaDesejos: number;
    abandonadas: number;

    totalLivros: number;
    totalMangas: number;
    totalSeries: number;
    totalFilmes: number;
    totalJogos: number;

    taxaConclusao: number;
}

import type {
    Obra,
    TipoObra,
    StatusObra
} from "../types/Obra";

export const nomesTipos: Record<TipoObra, string> = {
    LIVRO: "Livro",
    MANGA: "Mangá",
    SERIE: "Série",
    FILME: "Filme",
    JOGO: "Jogo"
};

export const nomesStatus: Record<StatusObra, string> = {
    LISTA_DESEJOS: "Lista de desejos",
    EM_ANDAMENTO: "Em andamento",
    CONCLUIDO: "Concluído",
    ABANDONADO: "Abandonado"
};

export function calcularProgresso(obra: Obra): number {

    if (!obra.quantidadeTotal || obra.progressoAtual === null) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                (obra.progressoAtual / obra.quantidadeTotal) * 100
            )
        )
    );
}

export function formatarData(data: string | null): string {

    if (!data) {
        return "Não informada";
    }

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
}

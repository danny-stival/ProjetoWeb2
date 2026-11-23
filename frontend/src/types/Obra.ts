export type TipoObra =
    | "LIVRO"
    | "MANGA"
    | "SERIE"
    | "FILME"
    | "JOGO";

export type StatusObra =
    | "LISTA_DESEJOS"
    | "EM_ANDAMENTO"
    | "ABANDONADO"
    | "CONCLUIDO";

export interface Obra {
    id: number;
    titulo: string;
    criador: string | null;
    descricao: string | null;
    genero: string | null;
    anoLancamento: number | null;
    capaUrl: string | null;

    tipo: TipoObra;
    status: StatusObra;

    dataInicio: string | null;
    dataConclusao: string | null;

    quantidadeTotal: number | null;
    progressoAtual: number | null;
    unidadeTotal: string | null;
}

export type ObraRequest = Omit<Obra, "id">;

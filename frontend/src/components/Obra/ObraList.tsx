
import { useEffect, useState } from "react";

import { listarObras } from "../../services/obraService";

import type {
    Obra,
    TipoObra,
    StatusObra
} from "../../types/Obra";

import ObraDetalhes from "./ObraDetalhes";

import {
    nomesTipos,
    nomesStatus,
    calcularProgresso
} from "../../utils/obraUtils";

interface ObraListProps {
    atualizar: number;
}

type Ordenacao =
    | "RECENTES"
    | "TITULO_ASC"
    | "TITULO_DESC"
    | "ANO";

export default function ObraList({ atualizar }: ObraListProps) {

    const [obras, setObras] = useState<Obra[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [obraSelecionada, setObraSelecionada] =
        useState<Obra | null>(null);

    const [capasComErro, setCapasComErro] =
        useState<number[]>([]);

    const [atualizacaoLocal, setAtualizacaoLocal] =
        useState(0);

    // Estados da pesquisa e dos filtros

    const [pesquisa, setPesquisa] = useState("");

    const [filtroTipo, setFiltroTipo] =
        useState<TipoObra | "TODOS">("TODOS");

    const [filtroStatus, setFiltroStatus] =
        useState<StatusObra | "TODOS">("TODOS");

    const [ordenacao, setOrdenacao] =
        useState<Ordenacao>("RECENTES");

    // Carrega as obras do usuário

    useEffect(() => {

        async function carregarObras() {

            setCarregando(true);
            setErro("");

            try {

                const dados = await listarObras();

                setObras(dados);
                setCapasComErro([]);

            } catch {

                setErro(
                    "Não foi possível carregar suas obras."
                );

            } finally {

                setCarregando(false);

            }
        }

        carregarObras();

    }, [atualizar, atualizacaoLocal]);

    function atualizarBiblioteca() {
        setAtualizacaoLocal(valor => valor + 1);
    }

    // Remove diferenças de acentuação e letras maiúsculas

    function normalizarTexto(texto: string): string {

        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    // Restaura os filtros

    function limparFiltros() {

        setPesquisa("");
        setFiltroTipo("TODOS");
        setFiltroStatus("TODOS");
        setOrdenacao("RECENTES");
    }

    // Aplica a pesquisa e os filtros

    const termoPesquisa = normalizarTexto(pesquisa);

    const obrasFiltradas = obras.filter((obra) => {

        const titulo = normalizarTexto(obra.titulo);

        const criador = normalizarTexto(
            obra.criador ?? ""
        );

        const correspondePesquisa =
            titulo.includes(termoPesquisa) ||
            criador.includes(termoPesquisa);

        const correspondeTipo =
            filtroTipo === "TODOS" ||
            obra.tipo === filtroTipo;

        const correspondeStatus =
            filtroStatus === "TODOS" ||
            obra.status === filtroStatus;

        return (
            correspondePesquisa &&
            correspondeTipo &&
            correspondeStatus
        );
    });

    // Ordena o resultado dos filtros

    const obrasOrdenadas = obrasFiltradas.sort((a, b) => {

        switch (ordenacao) {

            case "TITULO_ASC":

                return a.titulo.localeCompare(
                    b.titulo,
                    "pt-BR"
                );

            case "TITULO_DESC":

                return b.titulo.localeCompare(
                    a.titulo,
                    "pt-BR"
                );

            case "ANO":

                return (
                    (b.anoLancamento ?? -1) -
                    (a.anoLancamento ?? -1)
                );

            case "RECENTES":

            default:

                return b.id - a.id;
        }
    });

    const filtrosAtivos =
        pesquisa.trim() !== "" ||
        filtroTipo !== "TODOS" ||
        filtroStatus !== "TODOS" ||
        ordenacao !== "RECENTES";

    if (carregando) {
        return <p>Carregando suas histórias...</p>;
    }

    if (erro) {
        return <p role="alert">{erro}</p>;
    }

    return (
        <div className="biblioteca">

            <div className="biblioteca-titulo">

                <h2>Minhas obras</h2>

                <span className="contador-obras">
                    {obras.length} histórias
                </span>

            </div>

            {obras.length > 0 && (

                <section
                    className="biblioteca-filtros"
                    aria-label="Pesquisa e filtros"
                >

                    <div className="filtros-cabecalho">
                        <span>✳ EXPLORE SUA COLEÇÃO</span>
                    </div>

                    <div className="campo-pesquisa">

                        <label htmlFor="pesquisa-obra">
                            Buscar história
                        </label>

                        <input
                            id="pesquisa-obra"
                            type="search"
                            placeholder="Digite um título ou criador..."
                            value={pesquisa}
                            onChange={(e) =>
                                setPesquisa(e.target.value)
                            }
                        />

                    </div>

                    <div className="filtros-grid">

                        <div className="campo-filtro">

                            <label htmlFor="filtro-tipo">
                                Tipo de obra
                            </label>

                            <select
                                id="filtro-tipo"
                                value={filtroTipo}
                                onChange={(e) =>
                                    setFiltroTipo(
                                        e.target.value as
                                            TipoObra | "TODOS"
                                    )
                                }
                            >
                                <option value="TODOS">
                                    Todos os tipos
                                </option>

                                {Object.entries(nomesTipos).map(
                                    ([valor, nome]) => (

                                        <option
                                            key={valor}
                                            value={valor}
                                        >
                                            {nome}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        <div className="campo-filtro">

                            <label htmlFor="filtro-status">
                                Status
                            </label>

                            <select
                                id="filtro-status"
                                value={filtroStatus}
                                onChange={(e) =>
                                    setFiltroStatus(
                                        e.target.value as
                                            StatusObra | "TODOS"
                                    )
                                }
                            >

                                <option value="TODOS">
                                    Todos os status
                                </option>

                                {Object.entries(nomesStatus).map(
                                    ([valor, nome]) => (

                                        <option
                                            key={valor}
                                            value={valor}
                                        >
                                            {nome}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        <div className="campo-filtro">

                            <label htmlFor="ordenacao">
                                Ordenar por
                            </label>

                            <select
                                id="ordenacao"
                                value={ordenacao}
                                onChange={(e) =>
                                    setOrdenacao(
                                        e.target.value as Ordenacao
                                    )
                                }
                            >

                                <option value="RECENTES">
                                    Adicionados recentemente
                                </option>

                                <option value="TITULO_ASC">
                                    Título — A a Z
                                </option>

                                <option value="TITULO_DESC">
                                    Título — Z a A
                                </option>

                                <option value="ANO">
                                    Ano de lançamento
                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="filtros-rodape">

                        <span aria-live="polite">
                            Exibindo {obrasOrdenadas.length}
                            {" de "}
                            {obras.length} histórias
                        </span>

                        {filtrosAtivos && (

                            <button
                                type="button"
                                className="botao-limpar-filtros"
                                onClick={limparFiltros}
                            >
                                Limpar filtros ×
                            </button>

                        )}

                    </div>

                </section>

            )}

            {obras.length === 0 ? (

                <div className="biblioteca-vazia">

                    <span>✳</span>

                    <h3>Sua história começa aqui!</h3>

                    <p>
                        Você ainda não cadastrou nenhuma obra.
                    </p>

                </div>

            ) : obrasOrdenadas.length === 0 ? (

                <div className="biblioteca-vazia">

                    <span>✳</span>

                    <h3>Nenhuma história encontrada</h3>

                    <p>
                        Experimente alterar sua pesquisa
                        ou os filtros selecionados.
                    </p>

                    <button
                        type="button"
                        onClick={limparFiltros}
                    >
                        Limpar filtros
                    </button>

                </div>

            ) : (

                <div className="obras-grid">

                    {obrasOrdenadas.map((obra) => (

                        <article
                            className="obra-card"
                            key={obra.id}
                        >

                            <div className="obra-capa">

                                {obra.capaUrl &&
                                !capasComErro.includes(obra.id) ? (

                                    <img
                                        src={obra.capaUrl}
                                        alt={`Capa de ${obra.titulo}`}
                                        loading="lazy"
                                        onError={() =>
                                            setCapasComErro(
                                                anteriores => [
                                                    ...anteriores,
                                                    obra.id
                                                ]
                                            )
                                        }
                                    />

                                ) : (

                                    <div className="capa-padrao">

                                        <span>✳</span>

                                        <small>
                                            DIÁRIO DE HISTÓRIAS
                                        </small>

                                    </div>

                                )}

                                <span className="obra-tipo">
                                    {nomesTipos[obra.tipo]}
                                </span>

                            </div>

                            <div className="obra-conteudo">

                                <h3>{obra.titulo}</h3>

                                {obra.criador && (

                                    <p className="obra-criador">
                                        {obra.criador}
                                    </p>

                                )}

                                {obra.genero && (

                                    <p className="obra-genero">
                                        {obra.genero}
                                    </p>

                                )}

                                <span
                                    className={`obra-status ${obra.status.toLowerCase()}`}
                                >
                                    {nomesStatus[obra.status]}
                                </span>

                                {obra.status === "EM_ANDAMENTO" &&
                                    obra.quantidadeTotal !== null &&
                                    obra.quantidadeTotal > 0 &&
                                    obra.progressoAtual !== null && (

                                        <div className="obra-progresso">

                                            <div className="progresso-info">

                                                <span>
                                                    {obra.progressoAtual}/
                                                    {obra.quantidadeTotal}
                                                    {" "}
                                                    {obra.unidadeTotal?.toLowerCase()}
                                                </span>

                                                <span>
                                                    {calcularProgresso(obra)}%
                                                </span>

                                            </div>

                                            <div
                                                className="progresso-barra"
                                                role="progressbar"
                                                aria-label={`Progresso de ${obra.titulo}`}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-valuenow={calcularProgresso(obra)}
                                            >

                                                <div
                                                    className="progresso-preenchimento"
                                                    style={{
                                                        width: `${calcularProgresso(obra)}%`
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    )}

                                <button
                                    type="button"
                                    className="botao-detalhes"
                                    aria-label={`Ver detalhes de ${obra.titulo}`}
                                    onClick={() =>
                                        setObraSelecionada(obra)
                                    }
                                >
                                    Ver detalhes →
                                </button>

                            </div>

                        </article>

                    ))}

                </div>

            )}

            {obraSelecionada && (

                <ObraDetalhes
                    key={obraSelecionada.id}
                    obra={obraSelecionada}
                    onFechar={() =>
                        setObraSelecionada(null)
                    }
                    onObraAtualizada={atualizarBiblioteca}
                />

            )}

        </div>
    );
}

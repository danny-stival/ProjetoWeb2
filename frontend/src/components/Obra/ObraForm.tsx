
import { useState, type FormEvent } from "react";
import {
    cadastrarObra,
    atualizarObra
} from "../../services/obraService";
import axios from "axios";

import type {
    Obra,
    ObraRequest,
    TipoObra,
    StatusObra
} from "../../types/Obra";

interface ObraFormProps {
    onObraCadastrada: () => void;
    obra?: Obra;
}

// Configurações dos campos conforme o tipo de obra
const configuracoes: Record<TipoObra, {
    criador: string;
    unidade: string;
    mostrarProgresso: boolean;
}> = {
    LIVRO: {
        criador: "Autor(a)",
        unidade: "Páginas",
        mostrarProgresso: true
    },
    MANGA: {
        criador: "Mangaká",
        unidade: "Capítulos",
        mostrarProgresso: true
    },
    SERIE: {
        criador: "Criador(a) / Diretor(a)",
        unidade: "Episódios",
        mostrarProgresso: true
    },
    FILME: {
        criador: "Diretor(a)",
        unidade: "Minutos",
        mostrarProgresso: false
    },
    JOGO: {
        criador: "Desenvolvedora",
        unidade: "Horas",
        mostrarProgresso: true
    }
};

export default function ObraForm({
                                     onObraCadastrada,
                                     obra
                                 }: ObraFormProps) {

    const editando = obra !== undefined;

    const [titulo, setTitulo] =
        useState(obra?.titulo ?? "");

    const [criador, setCriador] =
        useState(obra?.criador ?? "");

    const [descricao, setDescricao] =
        useState(obra?.descricao ?? "");

    const [genero, setGenero] =
        useState(obra?.genero ?? "");

    const [anoLancamento, setAnoLancamento] =
        useState(obra?.anoLancamento?.toString() ?? "");

    const [capaUrl, setCapaUrl] =
        useState(obra?.capaUrl ?? "");

    const [tipo, setTipo] =
        useState<TipoObra>(obra?.tipo ?? "LIVRO");

    const [status, setStatus] =
        useState<StatusObra>(
            obra?.status ?? "LISTA_DESEJOS"
        );

    const [dataInicio, setDataInicio] =
        useState(obra?.dataInicio ?? "");

    const [dataConclusao, setDataConclusao] =
        useState(obra?.dataConclusao ?? "");

    const [quantidadeTotal, setQuantidadeTotal] =
        useState(obra?.quantidadeTotal?.toString() ?? "");

    const [progressoAtual, setProgressoAtual] =
        useState(obra?.progressoAtual?.toString() ?? "");

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const config = configuracoes[tipo];

    const possuiProgresso =
        config.mostrarProgresso &&
        status !== "LISTA_DESEJOS";

    // Limpa os campos após um novo cadastro
    function limparFormulario() {

        setTitulo("");
        setCriador("");
        setDescricao("");
        setGenero("");
        setAnoLancamento("");
        setCapaUrl("");
        setTipo("LIVRO");
        setStatus("LISTA_DESEJOS");
        setDataInicio("");
        setDataConclusao("");
        setQuantidadeTotal("");
        setProgressoAtual("");
    }

    // Responsável pelo cadastro e pela edição
    async function salvarObra(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setErro("");
        setCarregando(true);

        const dadosObra: ObraRequest = {

            titulo,
            criador: criador || null,
            descricao: descricao || null,
            genero: genero || null,

            anoLancamento: anoLancamento
                ? Number(anoLancamento)
                : null,

            capaUrl: capaUrl || null,

            tipo,
            status,

            dataInicio:
                status !== "LISTA_DESEJOS"
                    ? dataInicio || null
                    : null,

            dataConclusao:
                status === "CONCLUIDO"
                    ? dataConclusao || null
                    : null,

            quantidadeTotal:
                possuiProgresso && quantidadeTotal
                    ? Number(quantidadeTotal)
                    : null,

            progressoAtual:
                !possuiProgresso
                    ? null
                    : status === "CONCLUIDO"
                        ? quantidadeTotal
                            ? Number(quantidadeTotal)
                            : null
                        : progressoAtual
                            ? Number(progressoAtual)
                            : null,

            unidadeTotal:
                possuiProgresso
                    ? config.unidade
                    : null
        };

        try {

            if (obra) {

                await atualizarObra(obra.id, dadosObra);

                alert("Obra atualizada com sucesso!");

            } else {

                await cadastrarObra(dadosObra);

                alert("Obra cadastrada com sucesso!");

                limparFormulario();
            }

            onObraCadastrada();

        } catch (error) {

            if (axios.isAxiosError(error)) {

                const mensagem =
                    error.response?.data?.mensagem;

                if (typeof mensagem === "string" && mensagem) {

                    setErro(mensagem);

                } else if (!error.response) {

                    setErro(
                        "Não foi possível conectar ao servidor."
                    );

                } else if (error.response.status === 400) {

                    setErro("Confira os dados informados.");

                } else if (error.response.status === 401) {

                    setErro(
                        "Sua sessão expirou. Faça login novamente."
                    );

                } else {

                    setErro(
                        editando
                            ? "Não foi possível atualizar a obra."
                            : "Não foi possível cadastrar a obra."
                    );
                }

            } else {

                setErro("Ocorreu um erro inesperado.");

            }

        } finally {

            setCarregando(false);

        }
    }

    return (
        <form onSubmit={salvarObra}>

            <h2>
                {editando
                    ? "Editar obra"
                    : "Adicionar nova obra"}
            </h2>

            <div>

                <label htmlFor="tipo">
                    Tipo de obra
                </label>

                <select
                    id="tipo"
                    value={tipo}
                    onChange={(e) => {
                        setTipo(e.target.value as TipoObra);
                        setQuantidadeTotal("");
                        setProgressoAtual("");
                    }}
                >
                    <option value="LIVRO">Livro</option>
                    <option value="MANGA">Mangá</option>
                    <option value="SERIE">Série</option>
                    <option value="FILME">Filme</option>
                    <option value="JOGO">Jogo</option>
                </select>

            </div>

            <div>

                <label htmlFor="titulo">Título</label>

                <input
                    id="titulo"
                    value={titulo}
                    onChange={(e) =>
                        setTitulo(e.target.value)
                    }
                    required
                />

            </div>

            <div>

                <label htmlFor="criador">
                    {config.criador}
                </label>

                <input
                    id="criador"
                    value={criador}
                    onChange={(e) =>
                        setCriador(e.target.value)
                    }
                />

            </div>

            <div>

                <label htmlFor="genero">Gênero</label>

                <input
                    id="genero"
                    value={genero}
                    onChange={(e) =>
                        setGenero(e.target.value)
                    }
                />

            </div>

            <div>

                <label htmlFor="anoLancamento">
                    Ano de lançamento
                </label>

                <input
                    id="anoLancamento"
                    type="number"
                    min="0"
                    value={anoLancamento}
                    onChange={(e) =>
                        setAnoLancamento(e.target.value)
                    }
                />

            </div>

            <div>

                <label htmlFor="descricao">
                    Descrição
                </label>

                <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) =>
                        setDescricao(e.target.value)
                    }
                />

            </div>

            <div>

                <label htmlFor="capaUrl">
                    URL da capa
                </label>

                <input
                    id="capaUrl"
                    type="url"
                    value={capaUrl}
                    onChange={(e) =>
                        setCapaUrl(e.target.value)
                    }
                />

            </div>

            <div>

                <label htmlFor="status">
                    Status
                </label>

                <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value as StatusObra)
                    }
                >

                    <option value="LISTA_DESEJOS">
                        Lista de desejos
                    </option>

                    <option value="EM_ANDAMENTO">
                        Em andamento
                    </option>

                    <option value="CONCLUIDO">
                        Concluído
                    </option>

                    <option value="ABANDONADO">
                        Abandonado
                    </option>

                </select>

            </div>

            {status !== "LISTA_DESEJOS" && (

                <div>

                    <label htmlFor="dataInicio">
                        Data de início
                    </label>

                    <input
                        id="dataInicio"
                        type="date"
                        value={dataInicio}
                        onChange={(e) =>
                            setDataInicio(e.target.value)
                        }
                    />

                </div>

            )}

            {status === "CONCLUIDO" && (

                <div>

                    <label htmlFor="dataConclusao">
                        Data de conclusão
                    </label>

                    <input
                        id="dataConclusao"
                        type="date"
                        value={dataConclusao}
                        onChange={(e) =>
                            setDataConclusao(e.target.value)
                        }
                    />

                </div>

            )}

            {possuiProgresso && (

                <>

                    <div>

                        <label htmlFor="quantidadeTotal">
                            Total de {config.unidade.toLowerCase()}
                        </label>

                        <input
                            id="quantidadeTotal"
                            type="number"
                            min="0"
                            value={quantidadeTotal}
                            onChange={(e) =>
                                setQuantidadeTotal(e.target.value)
                            }
                        />

                    </div>

                    <div>

                        {status !== "CONCLUIDO" && (
                            <div>
                                <label htmlFor="progressoAtual">
                                    Progresso em {config.unidade.toLowerCase()}
                                </label>

                                <input
                                    id="progressoAtual"
                                    type="number"
                                    min="0"
                                    value={progressoAtual}
                                    onChange={(e) =>
                                        setProgressoAtual(e.target.value)
                                    }
                                />
                            </div>
                        )}

                    </div>

                </>

            )}

            {erro && <p role="alert">{erro}</p>}

            <button
                type="submit"
                disabled={carregando}
            >
                {carregando
                    ? "Salvando..."
                    : editando
                        ? "Salvar alterações"
                        : "Cadastrar obra"}
            </button>

        </form>
    );
}

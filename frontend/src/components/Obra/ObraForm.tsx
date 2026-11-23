
import { useState, type FormEvent } from "react";
import { cadastrarObra } from "../../services/obraService";
import type {
    ObraRequest,
    TipoObra,
    StatusObra
} from "../../types/Obra";

interface ObraFormProps {
    onObraCadastrada: () => void;
}

// Define os nomes dos campos conforme o tipo de obra
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
                                     onObraCadastrada
                                 }: ObraFormProps) {

    const [titulo, setTitulo] = useState("");
    const [criador, setCriador] = useState("");
    const [descricao, setDescricao] = useState("");
    const [genero, setGenero] = useState("");
    const [anoLancamento, setAnoLancamento] = useState("");
    const [capaUrl, setCapaUrl] = useState("");

    const [tipo, setTipo] = useState<TipoObra>("LIVRO");
    const [status, setStatus] =
        useState<StatusObra>("LISTA_DESEJOS");

    const [dataInicio, setDataInicio] = useState("");
    const [dataConclusao, setDataConclusao] = useState("");

    const [quantidadeTotal, setQuantidadeTotal] = useState("");
    const [progressoAtual, setProgressoAtual] = useState("");

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    // Configuração correspondente ao tipo selecionado
    const config = configuracoes[tipo];

    async function salvarObra(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErro("");
        setCarregando(true);

        const novaObra: ObraRequest = {
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

            dataInicio: dataInicio || null,
            dataConclusao: dataConclusao || null,

            quantidadeTotal:
                config.mostrarProgresso && quantidadeTotal
                    ? Number(quantidadeTotal)
                    : null,

            progressoAtual:
                config.mostrarProgresso && progressoAtual
                    ? Number(progressoAtual)
                    : null,

            unidadeTotal: config.mostrarProgresso
                ? config.unidade
                : null
        };

        try {
            await cadastrarObra(novaObra);

            alert("Obra cadastrada com sucesso!");

            // Limpa os campos
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

            onObraCadastrada();

        } catch {
            setErro("Não foi possível cadastrar a obra.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <form onSubmit={salvarObra}>
            <h2>Adicionar nova obra</h2>

            <div>
                <label htmlFor="tipo">Tipo de obra</label>
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
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="criador">{config.criador}</label>
                <input
                    id="criador"
                    value={criador}
                    onChange={(e) => setCriador(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="genero">Gênero</label>
                <input
                    id="genero"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
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
                <label htmlFor="descricao">Descrição</label>
                <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) =>
                        setDescricao(e.target.value)
                    }
                />
            </div>

            <div>
                <label htmlFor="capaUrl">URL da capa</label>
                <input
                    id="capaUrl"
                    type="url"
                    value={capaUrl}
                    onChange={(e) => setCapaUrl(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="status">Status</label>
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

            {config.mostrarProgresso &&
                status === "EM_ANDAMENTO" && (
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
                            <label htmlFor="progressoAtual">
                                {config.unidade} concluídos
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
                    </>
                )}

            {erro && <p role="alert">{erro}</p>}

            <button type="submit" disabled={carregando}>
                {carregando ? "Salvando..." : "Cadastrar obra"}
            </button>
        </form>
    );
}

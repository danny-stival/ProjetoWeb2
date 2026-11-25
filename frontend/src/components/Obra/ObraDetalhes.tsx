
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import type { Obra } from "../../types/Obra";
import { excluirObra } from "../../services/obraService";

import ObraForm from "./ObraForm";

import {
    nomesTipos,
    nomesStatus,
    calcularProgresso,
    formatarData
} from "../../utils/obraUtils";

interface ObraDetalhesProps {
    obra: Obra;
    onFechar: () => void;
    onObraAtualizada: () => void;
}

export default function ObraDetalhes({
                                         obra,
                                         onFechar,
                                         onObraAtualizada
                                     }: ObraDetalhesProps) {

    const modalRef = useRef<HTMLDialogElement>(null);

    const [erroCapa, setErroCapa] = useState(false);
    const [editando, setEditando] = useState(false);

    const [confirmandoExclusao, setConfirmandoExclusao] =
        useState(false);

    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState("");

    const progresso = calcularProgresso(obra);

    const possuiProgresso =
        obra.quantidadeTotal !== null &&
        obra.quantidadeTotal > 0 &&
        obra.progressoAtual !== null;

    useEffect(() => {

        const modal = modalRef.current;

        if (modal && !modal.open) {
            modal.showModal();
        }

        const overflowAnterior =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow =
                overflowAnterior;
        };

    }, []);

    function finalizarEdicao() {
        onObraAtualizada();
        onFechar();
    }

    function cancelarExclusao() {
        setConfirmandoExclusao(false);
        setErro("");
    }

    async function realizarExclusao() {

        if (excluindo) {
            return;
        }

        setErro("");
        setExcluindo(true);

        try {

            await excluirObra(obra.id);

            onObraAtualizada();
            onFechar();

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

                } else if (error.response.status === 401) {

                    setErro(
                        "Sua sessão expirou. Faça login novamente."
                    );

                } else {

                    setErro(
                        "Não foi possível excluir a obra."
                    );
                }

            } else {

                setErro("Ocorreu um erro inesperado.");

            }

        } finally {

            setExcluindo(false);

        }
    }

    return (
        <dialog
            ref={modalRef}
            className="modal-detalhes"
            aria-labelledby="titulo-obra-detalhes"
            onClose={onFechar}
            onClick={(event) => {

                if (
                    event.target === event.currentTarget &&
                    !editando &&
                    !confirmandoExclusao &&
                    !excluindo
                ) {
                    onFechar();
                }

            }}
            onCancel={(event) => {

                if (excluindo) {

                    event.preventDefault();

                } else if (confirmandoExclusao) {

                    event.preventDefault();
                    cancelarExclusao();

                } else if (editando) {

                    event.preventDefault();
                    setEditando(false);

                }

            }}
        >

            <div className="detalhes-conteudo">

                <div className="modal-topo">

                    <span>
                        {confirmandoExclusao
                            ? "✳ EXCLUIR FICHA"
                            : editando
                                ? "✳ EDITAR FICHA"
                                : "✳ FICHA DA OBRA"}

                        {" — Nº "}
                        {obra.id}
                    </span>

                    <button
                        type="button"
                        className="modal-fechar"
                        aria-label="Fechar"
                        disabled={excluindo}
                        onClick={onFechar}
                    >
                        ×
                    </button>

                </div>

                {confirmandoExclusao ? (

                    <div className="confirmacao-exclusao">

                        <div
                            className="exclusao-simbolo"
                            aria-hidden="true"
                        >
                            !
                        </div>

                        <h2 id="titulo-obra-detalhes">
                            Excluir esta história?
                        </h2>

                        <p>
                            Tem certeza de que deseja excluir
                            {" "}
                            <strong>{obra.titulo}</strong>
                            {" "}
                            da sua biblioteca?
                        </p>

                        <p className="exclusao-aviso">
                            Todas as informações e o progresso
                            desta obra serão removidos
                            permanentemente.
                            Essa ação não poderá ser desfeita.
                        </p>

                        {erro && <p role="alert">{erro}</p>}

                        <div className="exclusao-acoes">

                            <button
                                type="button"
                                disabled={excluindo}
                                onClick={cancelarExclusao}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="botao-excluir-obra"
                                disabled={excluindo}
                                onClick={realizarExclusao}
                            >
                                {excluindo
                                    ? "Excluindo..."
                                    : "Sim, excluir"}
                            </button>

                        </div>

                    </div>

                ) : editando ? (

                    <div className="detalhes-edicao">

                        <h2 id="titulo-obra-detalhes">
                            {obra.titulo}
                        </h2>

                        <ObraForm
                            obra={obra}
                            onObraCadastrada={finalizarEdicao}
                        />

                        <button
                            type="button"
                            className="botao-cancelar-edicao"
                            onClick={() => setEditando(false)}
                        >
                            Cancelar edição
                        </button>

                    </div>

                ) : (

                    <>

                        <div className="detalhes-principais">

                            <div className="detalhes-capa">

                                {obra.capaUrl && !erroCapa ? (

                                    <img
                                        src={obra.capaUrl}
                                        alt={`Capa de ${obra.titulo}`}
                                        onError={() =>
                                            setErroCapa(true)
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

                            </div>

                            <div className="detalhes-informacoes">

                                <span className="detalhes-categoria">
                                    {nomesTipos[obra.tipo]}
                                    {obra.genero && ` • ${obra.genero}`}
                                </span>

                                <h2 id="titulo-obra-detalhes">
                                    {obra.titulo}
                                </h2>

                                <p className="detalhes-criador">
                                    {obra.criador ||
                                        "Criador não informado"}
                                </p>

                                <p className="detalhes-ano">
                                    {obra.anoLancamento !== null
                                        ? `Lançamento: ${obra.anoLancamento}`
                                        : "Ano de lançamento não informado"}
                                </p>

                                <span
                                    className={`obra-status ${obra.status.toLowerCase()}`}
                                >
                                    {nomesStatus[obra.status]}
                                </span>

                                {possuiProgresso && (

                                    <div className="detalhes-progresso">

                                        <h3>Meu progresso</h3>

                                        <div className="progresso-info">

                                            <span>
                                                {obra.progressoAtual}/
                                                {obra.quantidadeTotal}
                                                {" "}
                                                {obra.unidadeTotal?.toLowerCase()}
                                            </span>

                                            <span>
                                                {progresso}%
                                            </span>

                                        </div>

                                        <div
                                            className="progresso-barra"
                                            role="progressbar"
                                            aria-label="Progresso da obra"
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={progresso}
                                        >

                                            <div
                                                className="progresso-preenchimento"
                                                style={{
                                                    width: `${progresso}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>

                        <section className="detalhes-descricao">

                            <h3>Sobre a história</h3>

                            <p>
                                {obra.descricao ||
                                    "Nenhuma descrição cadastrada."}
                            </p>

                        </section>

                        <section className="detalhes-datas">

                            <div className="detalhes-data">

                                <span>DATA DE INÍCIO</span>

                                <strong>
                                    {formatarData(obra.dataInicio)}
                                </strong>

                            </div>

                            <div className="detalhes-data">

                                <span>DATA DE CONCLUSÃO</span>

                                <strong>
                                    {formatarData(obra.dataConclusao)}
                                </strong>

                            </div>

                        </section>

                        <div className="detalhes-rodape">

                            <span>
                                DIÁRIO DE HISTÓRIAS — COLEÇÃO PESSOAL
                            </span>

                            <div className="detalhes-acoes">

                                <button
                                    type="button"
                                    className="botao-editar-obra"
                                    onClick={() => setEditando(true)}
                                >
                                    Editar obra
                                </button>

                                <button
                                    type="button"
                                    className="botao-excluir-obra"
                                    onClick={() => {
                                        setErro("");
                                        setConfirmandoExclusao(true);
                                    }}
                                >
                                    Excluir obra
                                </button>

                                <button
                                    type="button"
                                    onClick={onFechar}
                                >
                                    Fechar
                                </button>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </dialog>
    );
}

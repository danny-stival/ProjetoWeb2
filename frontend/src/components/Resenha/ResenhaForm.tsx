import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

import type { Obra } from "../../types/Obra";
import type { Resenha } from "../../types/Resenha";

import { listarObras } from "../../services/obraService";

import {
    cadastrarResenha,
    atualizarResenha
} from "../../services/resenhaService";

interface ResenhaFormProps {
    resenha?: Resenha;
    onSalvar: () => void;
    onCancelar: () => void;
}

export default function ResenhaForm({
                                        resenha,
                                        onSalvar,
                                        onCancelar
                                    }: ResenhaFormProps) {

    const [obras, setObras] = useState<Obra[]>([]);

    const [obraId, setObraId] = useState(
        resenha?.obraId.toString() || ""
    );

    const [titulo, setTitulo] = useState(
        resenha?.titulo || ""
    );

    const [comentario, setComentario] = useState(
        resenha?.comentario || ""
    );

    const [nota, setNota] = useState(
        resenha?.nota || 5
    );

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [carregandoObras, setCarregandoObras] = useState(true);

    useEffect(() => {

        let cancelado = false;

        listarObras()
            .then(dados => {
                if (!cancelado) {
                    setObras(dados);
                }
            })
            .catch(() => {
                if (!cancelado) {
                    setErro("Não foi possível carregar as obras.");
                }
            })
            .finally(() => {
                if (!cancelado) {
                    setCarregandoObras(false);
                }
            });

        return () => {
            cancelado = true;
        };

    }, []);

    async function salvar(event: FormEvent) {

        event.preventDefault();

        setErro("");
        setCarregando(true);

        const dados = {
            obraId: Number(obraId),
            titulo: titulo.trim(),
            comentario: comentario.trim(),
            nota
        };

        try {

            if (resenha) {

                await atualizarResenha(
                    resenha.id,
                    dados
                );

            } else {

                await cadastrarResenha(dados);
            }

            onSalvar();

        } catch (erro) {

            if (axios.isAxiosError(erro)) {

                setErro(
                    erro.response?.data?.mensagem ||
                    "Não foi possível salvar a resenha."
                );

            } else {

                setErro("Ocorreu um erro inesperado.");
            }

        } finally {

            setCarregando(false);
        }
    }

    return (

        <form
            className="resenha-form"
            onSubmit={salvar}
        >

            <h2>
                {resenha ? "Editar resenha" : "Nova resenha"}
            </h2>

            {erro && (
                <div className="resenha-erro" role="alert">
                    {erro}
                </div>
            )}

            {!carregandoObras && obras.length === 0 && (
                <p>
                    Cadastre uma história na biblioteca
                    antes de escrever uma resenha.
                </p>
            )}

            <label>

                Obra

                <select
                    value={obraId}
                    onChange={e => setObraId(e.target.value)}
                    disabled={carregandoObras || carregando}
                    required
                >

                    <option value="">
                        {carregandoObras
                            ? "Carregando obras..."
                            : "Selecione uma obra"}
                    </option>

                    {obras.map(obra => (

                        <option
                            key={obra.id}
                            value={obra.id}
                        >
                            {obra.titulo}
                        </option>

                    ))}

                </select>

            </label>

            <label>

                Título da resenha

                <input
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                    maxLength={150}
                    placeholder="Dê um título à sua experiência"
                    required
                />

            </label>

            <div>

                <strong>Minha avaliação</strong>

                <div className="resenha-estrelas">

                    {[1, 2, 3, 4, 5].map(valor => (

                        <button
                            key={valor}
                            type="button"
                            className={
                                valor <= nota ? "ativa" : ""
                            }
                            aria-label={`${valor} estrelas`}
                            aria-pressed={valor === nota}
                            onClick={() => setNota(valor)}
                        >
                            ★
                        </button>

                    ))}

                </div>

                <small>{nota} de 5 estrelas</small>

            </div>

            <label>

                Minha opinião

                <textarea
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    maxLength={5000}
                    rows={7}
                    placeholder="O que essa história significou para você?"
                    required
                />

                <small>
                    {comentario.length}/5000 caracteres
                </small>

            </label>

            <div className="resenha-acoes">

                <button
                    type="button"
                    className="resenha-botao-secundario"
                    onClick={onCancelar}
                    disabled={carregando}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    className="resenha-botao"
                    disabled={
                        carregando ||
                        carregandoObras ||
                        obras.length === 0
                    }
                >
                    {carregando ? "Salvando..." : "Salvar resenha"}
                </button>

            </div>

        </form>
    );
}
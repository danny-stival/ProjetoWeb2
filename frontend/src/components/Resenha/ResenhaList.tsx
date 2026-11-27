import { useEffect, useState } from "react";
import axios from "axios";

import type { Resenha } from "../../types/Resenha";

import {
    listarResenhas,
    excluirResenha
} from "../../services/resenhaService";

import ResenhaItem from "./ResenhaItem";

interface ResenhaListProps {
    atualizar: number;
    onEditar: (resenha: Resenha) => void;
}

export default function ResenhaList({
                                        atualizar,
                                        onEditar
                                    }: ResenhaListProps) {

    const [resenhas, setResenhas] = useState<Resenha[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [excluindo, setExcluindo] = useState<number | null>(null);
    const [busca, setBusca] = useState("");
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {

        let cancelado = false;

        setCarregando(true);
        setErro("");

        listarResenhas()
            .then(dados => {
                if (!cancelado) {
                    setResenhas(dados);
                }
            })
            .catch(() => {
                if (!cancelado) {
                    setErro("Não foi possível carregar as resenhas.");
                }
            })
            .finally(() => {
                if (!cancelado) {
                    setCarregando(false);
                }
            });

        return () => {
            cancelado = true;
        };

    }, [atualizar, recarregar]);

    async function excluir(id: number) {

        if (!window.confirm("Deseja excluir esta resenha?")) {
            return;
        }

        setExcluindo(id);
        setErro("");

        try {

            await excluirResenha(id);

            setRecarregar(valor => valor + 1);

        } catch (erro) {

            setErro(
                axios.isAxiosError(erro)
                    ? erro.response?.data?.mensagem ||
                    "Não foi possível excluir a resenha."
                    : "Ocorreu um erro inesperado."
            );

        } finally {

            setExcluindo(null);
        }
    }

    const termo = busca.trim().toLowerCase();

    const filtradas = resenhas.filter(resenha =>

        resenha.titulo.toLowerCase().includes(termo) ||
        resenha.obraTitulo.toLowerCase().includes(termo) ||
        resenha.comentario.toLowerCase().includes(termo)

    );

    return (

        <div className="resenha-lista">

        <input
            className="resenha-busca"
    placeholder="Pesquisar resenhas..."
    value={busca}
    onChange={e => setBusca(e.target.value)}
    aria-label="Pesquisar resenhas"
        />

        {erro && (
            <div className="resenha-erro" role="alert">
        {erro}
        </div>
)}

    {carregando ? (

        <p>Carregando resenhas...</p>

    ) : filtradas.length === 0 ? (

        <div className="resenha-vazia">

            <h3>Nenhuma resenha encontrada</h3>

    <p>
    {busca
        ? "Tente pesquisar outro título."
        : "Registre suas impressões sobre suas histórias favoritas."}
        </p>

        </div>

    ) : (

        <div className="resenha-grid">

            {filtradas.map(resenha => (

                    <ResenhaItem
                        key={resenha.id}
                resenha={resenha}
                onEditar={onEditar}
                onExcluir={excluir}
                excluindo={excluindo === resenha.id}
        />

    ))}

        </div>

    )}

    </div>
);
}
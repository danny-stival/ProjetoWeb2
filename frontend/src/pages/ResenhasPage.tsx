import { useState } from "react";

import ResenhaList from "../components/Resenha/ResenhaList";
import ResenhaForm from "../components/Resenha/ResenhaForm";

import type { Resenha } from "../types/Resenha";

import "../components/Resenha/Resenha.css";

export default function ResenhasPage() {

    const [formAberto, setFormAberto] = useState(false);

    const [resenhaEditando, setResenhaEditando] =
        useState<Resenha | undefined>(undefined);

    const [atualizar, setAtualizar] = useState(0);

    function novaResenha() {

        setResenhaEditando(undefined);
        setFormAberto(true);
    }

    function editarResenha(resenha: Resenha) {

        setResenhaEditando(resenha);
        setFormAberto(true);
    }

    function fecharFormulario() {

        setFormAberto(false);
        setResenhaEditando(undefined);
    }

    function resenhaSalva() {

        fecharFormulario();

        setAtualizar(valor => valor + 1);
    }

    return (

        <>

            <section className="boas-vindas">

                <span className="etiqueta">
                    EST. 2026 — IMPRESSÕES PESSOAIS
                </span>

                <h2>Minhas resenhas</h2>

                <p>
                    Histórias que merecem algumas palavras.
                    Registre suas experiências e opiniões.
                </p>

            </section>

            <div className="biblioteca-acoes">

                <span className="biblioteca-subtitulo">
                    ✳ MEU DIÁRIO DE IMPRESSÕES
                </span>

                <button
                    className="botao-nova-obra"
                    onClick={novaResenha}
                    disabled={formAberto}
                >
                    + Nova resenha
                </button>

            </div>

            {formAberto && (

                <section className="resenha-card resenha-formulario">

                    <ResenhaForm
                        key={resenhaEditando?.id ?? "nova"}
                        resenha={resenhaEditando}
                        onSalvar={resenhaSalva}
                        onCancelar={fecharFormulario}
                    />

                </section>

            )}

            <ResenhaList
                atualizar={atualizar}
                onEditar={editarResenha}
            />

        </>
    );
}
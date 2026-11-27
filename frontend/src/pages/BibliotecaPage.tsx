import { useEffect, useState } from "react";

import ObraList from "../components/Obra/ObraList";
import ObraForm from "../components/Obra/ObraForm";

export default function BibliotecaPage() {

    const [atualizarObras, setAtualizarObras] = useState(0);
    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {

        if (!modalAberto) return;

        function fecharComEsc(event: KeyboardEvent) {

            if (event.key === "Escape") {
                setModalAberto(false);
            }
        }

        document.addEventListener("keydown", fecharComEsc);

        const overflowAnterior = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {

            document.removeEventListener(
                "keydown",
                fecharComEsc
            );

            document.body.style.overflow = overflowAnterior;
        };

    }, [modalAberto]);

    function obraCadastrada() {

        setAtualizarObras(valor => valor + 1);
        setModalAberto(false);
    }

    return (

        <>

            <section className="boas-vindas">

                <span className="etiqueta">
                    EST. 2026 — COLEÇÃO PESSOAL
                </span>

                <h2>Minha biblioteca</h2>

                <p>
                    Toda história merece ser lembrada.
                    Colecione, descubra e revisite
                    seus universos favoritos.
                </p>

            </section>

            <div className="biblioteca-acoes">

                <span className="biblioteca-subtitulo">
                    ✳ SUA ESTANTE PESSOAL
                </span>

                <button
                    className="botao-nova-obra"
                    onClick={() => setModalAberto(true)}
                >
                    + Nova história
                </button>

            </div>

            <section className="painel-biblioteca">

                <ObraList atualizar={atualizarObras} />

            </section>

            {modalAberto && (

                <div
                    className="modal-overlay"
                    onClick={() => setModalAberto(false)}
                >

                    <div
                        className="modal-conteudo"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Adicionar nova obra"
                        onClick={event => event.stopPropagation()}
                    >

                        <div className="modal-topo">

                            <span>
                                NOVA FICHA — COLEÇÃO PESSOAL
                            </span>

                            <button
                                type="button"
                                className="modal-fechar"
                                aria-label="Fechar formulário"
                                onClick={() => setModalAberto(false)}
                            >
                                ×
                            </button>

                        </div>

                        <ObraForm
                            onObraCadastrada={obraCadastrada}
                        />

                    </div>

                </div>

            )}

        </>
    );
}
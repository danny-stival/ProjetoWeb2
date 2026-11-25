
import { useState, useEffect } from "react";

import Login from "./components/Auth/Login";
import Cadastro from "./components/Auth/Cadastro";
import ObraList from "./components/Obra/ObraList";
import ObraForm from "./components/Obra/ObraForm";

import { estaAutenticado, logout } from "./services/authService";

import "./App.css";

type Tela = "login" | "cadastro" | "dashboard";

export default function App() {

    const [tela, setTela] = useState<Tela>(
        estaAutenticado() ? "dashboard" : "login"
    );

    const [atualizarObras, setAtualizarObras] = useState(0);

    // Controla a abertura do formulário
    const [modalAberto, setModalAberto] = useState(false);

    // Permite fechar o modal com a tecla ESC
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
            document.removeEventListener("keydown", fecharComEsc);
            document.body.style.overflow = overflowAnterior;
        };
    }, [modalAberto]);

    function entrar() {
        setTela("dashboard");
    }

    function sair() {
        logout();
        setModalAberto(false);
        setTela("login");
    }

    function obraCadastrada() {
        setAtualizarObras(valor => valor + 1);
        setModalAberto(false);
    }

    if (tela === "login") {
        return (
            <div className="auth-container">
                <Login
                    onLogin={entrar}
                    onIrParaCadastro={() => setTela("cadastro")}
                />
            </div>
        );
    }

    if (tela === "cadastro") {
        return (
            <div className="auth-container">
                <Cadastro
                    onVoltarLogin={() => setTela("login")}
                />
            </div>
        );
    }

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <div className="marca">
                    <span className="marca-subtitulo">
                        Seu universo de histórias
                    </span>

                    <h1>Diário de Histórias</h1>
                </div>

                <button className="botao-sair" onClick={sair}>
                    Sair
                </button>
            </header>

            <div className="faixa-retro" />

            <main className="dashboard-main">

                <section className="boas-vindas">
                    <span className="etiqueta">
                        EST. 2026 — COLEÇÃO PESSOAL
                    </span>

                    <h2>Minha biblioteca</h2>

                    <p>
                        Toda história merece ser lembrada.
                        Colecione, descubra e revisite seus
                        universos favoritos.
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

            </main>

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
                        onClick={(event) => event.stopPropagation()}
                    >

                        <div className="modal-topo">
                            <span>NOVA FICHA — COLEÇÃO PESSOAL</span>

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

            <footer className="dashboard-footer">
                Diário de Histórias — Desde 2026
            </footer>

        </div>
    );
}

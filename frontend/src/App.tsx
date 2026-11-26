import { useState, useEffect } from "react";
import axios from "axios";

import Login from "./components/Auth/Login";
import Cadastro from "./components/Auth/Cadastro";

import ObraList from "./components/Obra/ObraList";
import ObraForm from "./components/Obra/ObraForm";

import MenuUsuario from "./components/Perfil/MenuUsuario";
import Avatar from "./components/Perfil/Avatar";

import {
    estaAutenticado,
    logout
} from "./services/authService";

import {
    consultarPerfil,
    consultarFoto
} from "./services/perfilService";

import type { Perfil } from "./types/Perfil";

import "./App.css";

type Tela =
    | "login"
    | "cadastro"
    | "dashboard"
    | "perfil";

export default function App() {

    const [tela, setTela] = useState<Tela>(
        estaAutenticado() ? "dashboard" : "login"
    );

    const [atualizarObras, setAtualizarObras] =
        useState(0);

    const [modalAberto, setModalAberto] =
        useState(false);

    const [perfil, setPerfil] =
        useState<Perfil | null>(null);

    const [fotoUrl, setFotoUrl] =
        useState<string | null>(null);

    const [erroPerfil, setErroPerfil] =
        useState("");

    const [recarregarPerfil, setRecarregarPerfil] =
        useState(0);

    const autenticado =
        tela === "dashboard" || tela === "perfil";

    // Carrega os dados do usuário autenticado
    useEffect(() => {

        if (!autenticado) return;

        let cancelado = false;
        let urlTemporaria: string | null = null;

        async function carregarPerfil() {

            setErroPerfil("");

            try {

                const dados = await consultarPerfil();

                if (cancelado) return;

                setPerfil(dados);

            } catch (erro) {

                if (cancelado) return;

                if (
                    axios.isAxiosError(erro) &&
                    erro.response?.status === 401
                ) {
                    logout();
                    setPerfil(null);
                    setFotoUrl(null);
                    setModalAberto(false);
                    setTela("login");
                    return;
                }

                setErroPerfil(
                    "Não foi possível carregar seu perfil."
                );

                return;
            }

            try {

                const imagem = await consultarFoto();

                if (cancelado) return;

                if (imagem) {

                    urlTemporaria =
                        URL.createObjectURL(imagem);

                    setFotoUrl(urlTemporaria);

                } else {

                    setFotoUrl(null);
                }

            } catch (erro) {

                if (cancelado) return;

                if (
                    axios.isAxiosError(erro) &&
                    erro.response?.status === 401
                ) {
                    logout();
                    setPerfil(null);
                    setFotoUrl(null);
                    setModalAberto(false);
                    setTela("login");
                    return;
                }

                setFotoUrl(null);

                console.error(
                    "Não foi possível carregar a fotografia."
                );
            }
        }

        carregarPerfil();

        return () => {

            cancelado = true;

            if (urlTemporaria) {
                URL.revokeObjectURL(urlTemporaria);
            }
        };

    }, [autenticado, recarregarPerfil]);

    // Controle do modal de cadastro de obras
    useEffect(() => {

        if (!modalAberto) return;

        function fecharComEsc(event: KeyboardEvent) {

            if (event.key === "Escape") {
                setModalAberto(false);
            }
        }

        document.addEventListener(
            "keydown",
            fecharComEsc
        );

        const overflowAnterior =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {

            document.removeEventListener(
                "keydown",
                fecharComEsc
            );

            document.body.style.overflow =
                overflowAnterior;
        };

    }, [modalAberto]);

    function entrar() {

        setPerfil(null);
        setFotoUrl(null);
        setErroPerfil("");
        setTela("dashboard");
    }

    function sair() {

        logout();

        setPerfil(null);
        setFotoUrl(null);
        setErroPerfil("");

        setModalAberto(false);
        setAtualizarObras(0);

        setTela("login");
    }

    function abrirPerfil() {

        setModalAberto(false);
        setTela("perfil");
    }

    function abrirBiblioteca() {

        setTela("dashboard");
    }

    function obraCadastrada() {

        setAtualizarObras(valor => valor + 1);
        setModalAberto(false);
    }

    // Tela de login
    if (tela === "login") {

        return (
            <div className="auth-container">

                <Login
                    onLogin={entrar}
                    onIrParaCadastro={() =>
                        setTela("cadastro")
                    }
                />

            </div>
        );
    }

    // Tela de cadastro
    if (tela === "cadastro") {

        return (
            <div className="auth-container">

                <Cadastro
                    onVoltarLogin={() =>
                        setTela("login")
                    }
                />

            </div>
        );
    }

    // Área autenticada
    return (

        <div className="dashboard">

            <header className="dashboard-header">

                <div className="marca">

                    <span className="marca-subtitulo">
                        Seu universo de histórias
                    </span>

                    <h1>Diário de Histórias</h1>

                </div>

                {perfil ? (

                    <MenuUsuario
                        perfil={perfil}
                        fotoUrl={fotoUrl}
                        onAbrirPerfil={abrirPerfil}
                        onAbrirBiblioteca={abrirBiblioteca}
                        onSair={sair}
                    />

                ) : (

                    <button
                        className="botao-sair"
                        onClick={sair}
                    >
                        Sair
                    </button>

                )}

            </header>

            <div className="faixa-retro" />

            <main className="dashboard-main">

                {erroPerfil && (

                    <div role="alert">

                        <p>{erroPerfil}</p>

                        <button
                            type="button"
                            onClick={() =>
                                setRecarregarPerfil(
                                    valor => valor + 1
                                )
                            }
                        >
                            Tentar novamente
                        </button>

                    </div>

                )}

                {tela === "dashboard" ? (

                    <>

                        <section className="boas-vindas">

                            <span className="etiqueta">
                                EST. 2026 — COLEÇÃO PESSOAL
                            </span>

                            <h2>Minha biblioteca</h2>

                            <p>
                                Toda história merece ser
                                lembrada. Colecione, descubra
                                e revisite seus universos
                                favoritos.
                            </p>

                        </section>

                        <div className="biblioteca-acoes">

                            <span className="biblioteca-subtitulo">
                                ✳ SUA ESTANTE PESSOAL
                            </span>

                            <button
                                className="botao-nova-obra"
                                onClick={() =>
                                    setModalAberto(true)
                                }
                            >
                                + Nova história
                            </button>

                        </div>

                        <section className="painel-biblioteca">

                            <ObraList
                                atualizar={atualizarObras}
                            />

                        </section>

                    </>

                ) : (

                    <>

                        <button
                            type="button"
                            onClick={abrirBiblioteca}
                            className="botao-voltar-biblioteca"
                        >
                            ← Voltar à biblioteca
                        </button>

                        <section className="boas-vindas">

                            <span className="etiqueta">
                                EST. 2026 — IDENTIDADE PESSOAL
                            </span>

                            <h2>Ficha do colecionador</h2>

                            <p>
                                Cada história faz parte
                                da sua própria história.
                            </p>

                        </section>

                        {perfil && (

                            <section className="perfil-provisorio">

                                <Avatar
                                    nome={perfil.nome}
                                    fotoUrl={fotoUrl}
                                    tamanho="grande"
                                />

                                <div>

                                    <h2>{perfil.nome}</h2>

                                    <p>@{perfil.username}</p>

                                    <p>{perfil.email}</p>

                                </div>

                            </section>

                        )}

                    </>

                )}

            </main>

            {modalAberto && tela === "dashboard" && (

                <div
                    className="modal-overlay"
                    onClick={() => setModalAberto(false)}
                >

                    <div
                        className="modal-conteudo"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Adicionar nova obra"
                        onClick={event =>
                            event.stopPropagation()
                        }
                    >

                        <div className="modal-topo">

                            <span>
                                NOVA FICHA — COLEÇÃO PESSOAL
                            </span>

                            <button
                                type="button"
                                className="modal-fechar"
                                aria-label="Fechar formulário"
                                onClick={() =>
                                    setModalAberto(false)
                                }
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

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

import Login from "./components/Auth/Login";
import Cadastro from "./components/Auth/Cadastro";

import MenuUsuario from "./components/Perfil/MenuUsuario";

import BibliotecaPage from "./pages/BibliotecaPage";
import ResenhasPage from "./pages/ResenhasPage";
import PerfilPage from "./pages/PerfilPage";

import {
    estaAutenticado,
    logout
} from "./services/authService";

import {
    consultarPerfil,
    consultarFoto
} from "./services/perfilService";

import type { Perfil as PerfilDados } from "./types/Perfil";

import "./App.css";

function Aplicacao() {

    const navigate = useNavigate();

    const [autenticado, setAutenticado] =
        useState(estaAutenticado);

    const [perfil, setPerfil] =
        useState<PerfilDados | null>(null);

    const [fotoUrl, setFotoUrl] =
        useState<string | null>(null);

    const [erroPerfil, setErroPerfil] = useState("");

    const [recarregarPerfil, setRecarregarPerfil] =
        useState(0);

    const sair = useCallback(() => {

        logout();

        setAutenticado(false);
        setPerfil(null);
        setFotoUrl(null);
        setErroPerfil("");

        navigate("/login", { replace: true });

    }, [navigate]);

    function entrar() {

        setAutenticado(true);

        navigate("/biblioteca", { replace: true });
    }

    function atualizarDadosPerfil() {

        setRecarregarPerfil(valor => valor + 1);
    }

    useEffect(() => {

        if (!autenticado) return;

        let cancelado = false;
        let urlTemporaria: string | null = null;

        async function carregarPerfil() {

            setErroPerfil("");
            setFotoUrl(null);

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
                    sair();
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
                    sair();
                    return;
                }

                setErroPerfil(
                    "Não foi possível carregar a fotografia."
                );
            }
        }

        void carregarPerfil();

        return () => {

            cancelado = true;

            if (urlTemporaria) {
                URL.revokeObjectURL(urlTemporaria);
            }
        };

    }, [autenticado, recarregarPerfil, sair]);

    return (

        <Routes>

            {/* ROTAS PÚBLICAS */}

            <Route
                path="/login"
                element={
                    autenticado ? (

                        <Navigate
                            to="/biblioteca"
                            replace
                        />

                    ) : (

                        <div className="auth-container">

                            <Login
                                onLogin={entrar}
                                onIrParaCadastro={() =>
                                    navigate("/cadastro")
                                }
                            />

                        </div>

                    )
                }
            />

            <Route
                path="/cadastro"
                element={
                    autenticado ? (

                        <Navigate
                            to="/biblioteca"
                            replace
                        />

                    ) : (

                        <div className="auth-container">

                            <Cadastro
                                onVoltarLogin={() =>
                                    navigate("/login")
                                }
                            />

                        </div>

                    )
                }
            />

            {/* ROTAS PROTEGIDAS */}

            <Route
                element={
                    autenticado ? (

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
                                        onAbrirPerfil={() =>
                                            navigate("/perfil")
                                        }
                                        onAbrirBiblioteca={() =>
                                            navigate("/biblioteca")
                                        }
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

                            <nav
                                className="navegacao-principal"
                                aria-label="Navegação principal"
                            >

                                <NavLink to="/biblioteca">
                                    Biblioteca
                                </NavLink>

                                <NavLink to="/resenhas">
                                    Resenhas
                                </NavLink>

                                <NavLink to="/perfil">
                                    Meu perfil
                                </NavLink>

                            </nav>

                            <main className="dashboard-main">

                                {erroPerfil && (

                                    <div
                                        className="perfil-erro"
                                        role="alert"
                                    >

                                        <p>{erroPerfil}</p>

                                        <button
                                            className="perfil-botao-secundario"
                                            onClick={atualizarDadosPerfil}
                                        >
                                            Tentar novamente
                                        </button>

                                    </div>

                                )}

                                <Outlet />

                            </main>

                            <footer className="dashboard-footer">
                                Diário de Histórias — Desde 2026
                            </footer>

                        </div>

                    ) : (

                        <Navigate to="/login" replace />

                    )
                }
            >

                <Route
                    path="/biblioteca"
                    element={<BibliotecaPage />}
                />

                <Route
                    path="/resenhas"
                    element={<ResenhasPage />}
                />

                <Route
                    path="/perfil"
                    element={
                        <PerfilPage
                            perfil={perfil}
                            fotoUrl={fotoUrl}
                            onAtualizar={atualizarDadosPerfil}
                            onSair={sair}
                        />
                    }
                />

            </Route>

            {/* ROTA PADRÃO */}

            <Route
                path="*"
                element={
                    <Navigate
                        to={
                            autenticado
                                ? "/biblioteca"
                                : "/login"
                        }
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default function App() {

    return (

        <BrowserRouter>

            <Aplicacao />

        </BrowserRouter>

    );
}

import { useState } from "react";

import Login from "./components/Auth/Login";
import Cadastro from "./components/Auth/Cadastro";
import ObraList from "./components/Obra/ObraList";
import ObraForm from "./components/Obra/ObraForm";

import { estaAutenticado, logout } from "./services/authService";

import "./App.css";

type Tela = "login" | "cadastro" | "dashboard";

export default function App() {

    // Controla qual tela será exibida
    const [tela, setTela] = useState<Tela>(
        estaAutenticado() ? "dashboard" : "login"
    );

    // Controla quando a lista de obras deve ser atualizada
    const [atualizarObras, setAtualizarObras] = useState(0);

    // Executado quando o usuário faz login
    function entrar() {
        setTela("dashboard");
    }

    // Executado quando o usuário sai do sistema
    function sair() {
        logout();
        setTela("login");
    }

    // Executado quando uma nova obra é cadastrada
    function obraCadastrada() {
        setAtualizarObras(valor => valor + 1);
    }

    if (tela === "login") {
        return (
            <Login
                onLogin={entrar}
                onIrParaCadastro={() => setTela("cadastro")}
            />
        );
    }

    if (tela === "cadastro") {
        return (
            <Cadastro
                onVoltarLogin={() => setTela("login")}
            />
        );
    }

    return (
        <div>
            <header>
                <h1>Diário de Histórias</h1>

                <button onClick={sair}>
                    Sair
                </button>
            </header>

            <main>
                <h2>Minha biblioteca</h2>

                <ObraForm
                    onObraCadastrada={obraCadastrada}
                />

                <ObraList
                    atualizar={atualizarObras}
                />
            </main>
        </div>
    );
}

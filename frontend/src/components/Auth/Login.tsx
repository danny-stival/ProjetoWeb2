
import { useState, type FormEvent } from "react";
import axios from "axios";
import { login } from "../../services/authService";

interface LoginProps {
    onLogin: () => void;
    onIrParaCadastro: () => void;
}

export default function Login({
                                  onLogin,
                                  onIrParaCadastro
                              }: LoginProps) {

    const [username, setUsername] = useState("");
    const [senha, setSenha] = useState("");

    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function realizarLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            await login({ username, senha });

            // Limpa os campos após autenticação
            setUsername("");
            setSenha("");
            setMostrarSenha(false);

            onLogin();

        } catch (error) {

            if (axios.isAxiosError(error)) {

                const mensagem = error.response?.data?.mensagem;

                if (!error.response) {

                    setErro(
                        "Não foi possível conectar ao servidor."
                    );

                } else if (error.response.status === 401) {

                    setErro("Usuário ou senha incorretos.");

                } else if (error.response.status === 403) {

                    setErro("Acesso não autorizado.");

                } else if (
                    typeof mensagem === "string" && mensagem
                ) {

                    setErro(mensagem);

                } else {

                    setErro(
                        "Não foi possível entrar. Tente novamente."
                    );
                }

            } else {
                setErro("Ocorreu um erro inesperado.");
            }

        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="login-container">

            <h1>Diário de Histórias</h1>

            <p className="login-subtitulo">
                Biblioteca particular de historias!
            </p>

            <form onSubmit={realizarLogin}>

                <h2>Entrar</h2>

                <div className="campo-formulario">

                    <label htmlFor="login-username">
                        Usuário
                    </label>

                    <input
                        id="login-username"
                        name="username"
                        type="text"
                        placeholder="Digite seu usuário"
                        autoComplete="username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                    />

                </div>

                <div className="campo-formulario">

                    <label htmlFor="login-senha">
                        Senha
                    </label>

                    <div className="campo-senha">

                        <input
                            id="login-senha"
                            name="password"
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                            value={senha}
                            onChange={(e) =>
                                setSenha(e.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            className="botao-visualizar-senha"
                            onClick={() =>
                                setMostrarSenha(!mostrarSenha)
                            }
                            aria-label={
                                mostrarSenha
                                    ? "Ocultar senha"
                                    : "Mostrar senha"
                            }
                            aria-pressed={mostrarSenha}
                        >
                            {mostrarSenha ? "Ocultar" : "Mostrar"}
                        </button>

                    </div>

                </div>

                {erro && <p role="alert">{erro}</p>}

                <button
                    type="submit"
                    disabled={carregando}
                >
                    {carregando ? "Entrando..." : "Entrar"}
                </button>

            </form>

            <div className="login-criar-conta">

                <p>Ainda não tem uma conta?</p>

                <button
                    type="button"
                    className="botao-voltar-login"
                    onClick={onIrParaCadastro}
                >
                    Criar conta
                </button>

            </div>

        </div>
    );
}

import { useState, type FormEvent } from "react";
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
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function realizarLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            await login({ username, senha });
            onLogin();
        } catch {
            setErro("Não foi possível entrar. Confira seus dados.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="login-container">
            <h1>Diário de Histórias</h1>
            <p>Suas histórias favoritas em um só lugar.</p>

            <form onSubmit={realizarLogin}>
                <h2>Entrar</h2>

                <label htmlFor="username">Usuário</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="senha">Senha</label>
                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />

                {erro && <p role="alert">{erro}</p>}

                <button type="submit" disabled={carregando}>
                    {carregando ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p>Ainda não tem uma conta?</p>
            <button type="button" onClick={onIrParaCadastro}>
                Criar conta
            </button>
        </div>
    );
}

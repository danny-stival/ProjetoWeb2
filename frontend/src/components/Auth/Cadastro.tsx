
import { useState, type FormEvent } from "react";
import { cadastrar } from "../../services/authService";

interface CadastroProps {
    onVoltarLogin: () => void;
}

export default function Cadastro({ onVoltarLogin }: CadastroProps) {

    const [nome, setNome] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function realizarCadastro(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            await cadastrar({ nome, username, email, senha });

            alert("Cadastro realizado com sucesso!");
            onVoltarLogin();

        } catch {
            setErro("Não foi possível cadastrar. Confira os dados informados.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="cadastro-container">
            <h1>Diário de Histórias</h1>
            <h2>Criar conta</h2>

            <form onSubmit={realizarCadastro}>
                <label htmlFor="nome">Nome</label>
                <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />

                <label htmlFor="cadastro-username">Usuário</label>
                <input
                    id="cadastro-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="email">E-mail</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="cadastro-senha">Senha</label>
                <input
                    id="cadastro-senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />

                {erro && <p role="alert">{erro}</p>}

                <button type="submit" disabled={carregando}>
                    {carregando ? "Cadastrando..." : "Cadastrar"}
                </button>
            </form>

            <button type="button" onClick={onVoltarLogin}>
                Voltar para login
            </button>
        </div>
    );
}

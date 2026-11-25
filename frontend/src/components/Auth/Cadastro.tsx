
import { useState, type FormEvent } from "react";
import axios from "axios";
import { cadastrar } from "../../services/authService";

interface CadastroProps {
    onVoltarLogin: () => void;
}

export default function Cadastro({ onVoltarLogin }: CadastroProps) {

    const [nome, setNome] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function realizarCadastro(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErro("");

        // Verifica se as senhas coincidem
        if (senha !== confirmarSenha) {
            setErro("As senhas informadas não coincidem.");
            return;
        }

        setCarregando(true);

        try {
            await cadastrar({
                nome,
                username,
                email,
                senha
            });

            alert("Cadastro realizado com sucesso!");
            onVoltarLogin();

        } catch (error) {

            if (axios.isAxiosError(error)) {

                const mensagem = error.response?.data?.mensagem;

                if (typeof mensagem === "string" && mensagem) {
                    setErro(mensagem);

                } else if (!error.response) {
                    setErro(
                        "Não foi possível conectar ao servidor."
                    );

                } else if (error.response.status === 409) {
                    setErro(
                        "O usuário ou e-mail informado já está em uso."
                    );

                } else if (error.response.status === 400) {
                    setErro(
                        "Confira os dados informados."
                    );

                } else {
                    setErro(
                        "Não foi possível realizar o cadastro. Tente novamente."
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
        <div className="cadastro-container">

            <h1>Diário de Histórias</h1>
            <h2>Criar conta</h2>

            <form
                onSubmit={realizarCadastro}
                autoComplete="off"
            >

                <div className="campo-formulario">
                    <label htmlFor="nome">Nome</label>

                    <input
                        id="nome"
                        name="nome"
                        type="text"
                        placeholder="Seu nome"
                        autoComplete="name"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="campo-formulario">
                    <label htmlFor="cadastro-username">
                        Usuário
                    </label>

                    <input
                        id="cadastro-username"
                        name="cadastro-username"
                        type="text"
                        placeholder="Escolha seu usuário"
                        autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="campo-formulario">
                    <label htmlFor="email">E-mail</label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Seu e-mail"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="campo-formulario">
                    <label htmlFor="cadastro-senha">
                        Senha
                    </label>

                    <div className="campo-senha">

                        <input
                            id="cadastro-senha"
                            name="cadastro-senha"
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="Digite uma senha"
                            autoComplete="new-password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="botao-visualizar-senha"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
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

                <div className="campo-formulario">
                    <label htmlFor="confirmar-senha">
                        Confirme sua senha
                    </label>

                    <input
                        id="confirmar-senha"
                        name="confirmar-senha"
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="Digite a senha novamente"
                        autoComplete="new-password"
                        value={confirmarSenha}
                        onChange={(e) =>
                            setConfirmarSenha(e.target.value)
                        }
                        required
                    />

                    {confirmarSenha && (
                        <p
                            className={
                                senha === confirmarSenha
                                    ? "senha-valida"
                                    : "senha-invalida"
                            }
                        >
                            {senha === confirmarSenha
                                ? "✓ As senhas coincidem."
                                : "As senhas não coincidem."}
                        </p>
                    )}
                </div>

                {erro && <p role="alert">{erro}</p>}

                <button
                    type="submit"
                    disabled={carregando}
                >
                    {carregando
                        ? "Cadastrando..."
                        : "Cadastrar"}
                </button>

            </form>

            <button
                type="button"
                className="botao-voltar-login"
                onClick={onVoltarLogin}
            >
                Voltar para login
            </button>

        </div>
    );
}

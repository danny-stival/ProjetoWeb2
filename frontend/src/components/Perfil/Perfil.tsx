import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

import Avatar from "./Avatar";

import type {
    Perfil as PerfilDados,
    EstatisticasPerfil
} from "../../types/Perfil";

import {
    atualizarPerfil,
    alterarUsername,
    alterarSenha,
    consultarEstatisticas,
    atualizarFoto,
    removerFoto,
    excluirConta
} from "../../services/perfilService";

import "./Perfil.css";

interface PerfilProps {
    perfil: PerfilDados;
    fotoUrl: string | null;
    onAtualizar: () => void;
    onSair: () => void;
}

type Secao =
    | "dados"
    | "username"
    | "senha"
    | "excluir"
    | null;

export default function Perfil({
                                   perfil,
                                   fotoUrl,
                                   onAtualizar,
                                   onSair
                               }: PerfilProps) {

    const [estatisticas, setEstatisticas] =
        useState<EstatisticasPerfil | null>(null);

    const [secao, setSecao] = useState<Secao>(null);

    const [nome, setNome] = useState(perfil.nome);
    const [email, setEmail] = useState(perfil.email);

    const [novoUsername, setNovoUsername] =
        useState(perfil.username);

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [erroEstatisticas, setErroEstatisticas] =
        useState("");

    const [carregando, setCarregando] = useState(false);

    useEffect(() => {

        let cancelado = false;

        consultarEstatisticas()
            .then(dados => {
                if (!cancelado) {
                    setEstatisticas(dados);
                }
            })
            .catch(erro => {

                if (cancelado) return;

                if (
                    axios.isAxiosError(erro) &&
                    erro.response?.status === 401
                ) {
                    onSair();
                    return;
                }

                setErroEstatisticas(
                    "Não foi possível carregar as estatísticas."
                );
            });

        return () => {
            cancelado = true;
        };

    }, [perfil.id, onSair]);

    function abrirSecao(novaSecao: Secao) {

        setSecao(secao === novaSecao ? null : novaSecao);

        setNome(perfil.nome);
        setEmail(perfil.email);
        setNovoUsername(perfil.username);

        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
        setConfirmacao("");

        setErro("");
        setSucesso("");
    }

    async function executar(
        acao: () => Promise<void>,
        mensagem: string,
        encerrarSessao = false
    ) {

        setCarregando(true);
        setErro("");
        setSucesso("");

        try {

            await acao();

            if (encerrarSessao) {
                alert(mensagem);
                onSair();
                return;
            }

            setSucesso(mensagem);
            setSecao(null);

            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");
            setConfirmacao("");

            onAtualizar();

        } catch (erro) {

            if (axios.isAxiosError(erro)) {

                if (erro.response?.status === 401) {
                    onSair();
                    return;
                }

                setErro(
                    erro.response?.data?.mensagem ||
                    "Não foi possível concluir a operação."
                );

            } else {

                setErro("Ocorreu um erro inesperado.");
            }

        } finally {

            setCarregando(false);
        }
    }

    async function salvarDados(event: FormEvent) {

        event.preventDefault();

        await executar(
            async () => {
                await atualizarPerfil({ nome, email });
            },
            "Informações atualizadas com sucesso!"
        );
    }

    async function salvarUsername(event: FormEvent) {

        event.preventDefault();

        await executar(
            () => alterarUsername({
                novoUsername,
                senhaAtual
            }),
            "Username alterado! Entre novamente.",
            true
        );
    }

    async function salvarSenha(event: FormEvent) {

        event.preventDefault();

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não correspondem.");
            return;
        }

        await executar(
            () => alterarSenha({
                senhaAtual,
                novaSenha,
                confirmarSenha
            }),
            "Senha alterada! Entre novamente.",
            true
        );
    }

    async function enviarFoto(arquivo: File) {

        setErro("");
        setSucesso("");

        if (
            !["image/jpeg", "image/png"]
                .includes(arquivo.type)
        ) {
            setErro("Selecione uma imagem PNG ou JPEG.");
            return;
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            setErro("A imagem deve possuir no máximo 2 MB.");
            return;
        }

        await executar(
            () => atualizarFoto(arquivo),
            "Fotografia atualizada com sucesso!"
        );
    }

    async function apagarFoto() {

        if (!window.confirm("Deseja remover sua fotografia?")) {
            return;
        }

        await executar(
            removerFoto,
            "Fotografia removida com sucesso!"
        );
    }

    async function apagarConta(event: FormEvent) {

        event.preventDefault();

        if (confirmacao !== "EXCLUIR") {
            setErro("Digite EXCLUIR para confirmar.");
            return;
        }

        if (!window.confirm(
            "Excluir permanentemente sua conta e todas as suas obras?"
        )) {
            return;
        }

        await executar(
            () => excluirConta({
                senhaAtual,
                confirmacao
            }),
            "Sua conta foi excluída.",
            true
        );
    }

    return (

        <div className="perfil-pagina">

            {erro && (
                <div className="perfil-erro" role="alert">
                    {erro}
                </div>
            )}

            {sucesso && (
                <div className="perfil-sucesso" role="status">
                    {sucesso}
                </div>
            )}

            <fieldset
                className="perfil-conteudo"
                disabled={carregando}
            >

                {/* IDENTIDADE */}

                <section className="perfil-card perfil-identidade">

                    <Avatar
                        nome={perfil.nome}
                        fotoUrl={fotoUrl}
                        tamanho="grande"
                    />

                    <div className="perfil-identificacao">

                        <span className="perfil-etiqueta">
                            ✳ MEMBRO DA COLEÇÃO
                        </span>

                        <h2>{perfil.nome}</h2>

                        <p>@{perfil.username}</p>
                        <p>{perfil.email}</p>

                        <div className="perfil-acoes-foto">

                            <label className="perfil-upload">

                                Alterar fotografia

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    disabled={carregando}
                                    onChange={event => {

                                        const arquivo =
                                            event.target.files?.[0];

                                        event.target.value = "";

                                        if (arquivo) {
                                            void enviarFoto(arquivo);
                                        }
                                    }}
                                />

                            </label>

                            {fotoUrl && (
                                <button
                                    type="button"
                                    className="perfil-botao-secundario"
                                    onClick={apagarFoto}
                                >
                                    Remover foto
                                </button>
                            )}

                        </div>

                        <small>PNG ou JPEG — até 2 MB.</small>

                    </div>

                </section>

                {/* ESTATÍSTICAS */}

                <section className="perfil-card">

                    <span className="perfil-etiqueta">
                        ✳ MINHA TRAJETÓRIA
                    </span>

                    <h2>Minha coleção em números</h2>

                    {erroEstatisticas && (
                        <p role="alert">{erroEstatisticas}</p>
                    )}

                    {!estatisticas && !erroEstatisticas && (
                        <p>Carregando estatísticas...</p>
                    )}

                    {estatisticas && (

                        <>

                            <div className="perfil-estatisticas">

                                {[
                                    ["Total de histórias", estatisticas.totalObras, "mostarda"],
                                    ["Concluídas", estatisticas.concluidas, "verde"],
                                    ["Em andamento", estatisticas.emAndamento, "laranja"],
                                    ["Lista de desejos", estatisticas.listaDesejos, "creme"],
                                    ["Abandonadas", estatisticas.abandonadas, "vermelho"]
                                ].map(([titulo, valor, cor]) => (

                                    <div
                                        key={titulo}
                                        className={`perfil-numero ${cor}`}
                                    >
                                        <strong>{valor}</strong>
                                        <span>{titulo}</span>
                                    </div>

                                ))}

                            </div>

                            <div className="perfil-progresso">

                                <div className="perfil-progresso-titulo">
                                    <strong>Taxa de conclusão</strong>
                                    <strong>
                                        {estatisticas.taxaConclusao}%
                                    </strong>
                                </div>

                                <progress
                                    max={100}
                                    value={estatisticas.taxaConclusao}
                                    aria-label="Taxa de conclusão"
                                />

                            </div>

                            <h3>Minha coleção por categoria</h3>

                            <div className="perfil-categorias">

                                {[
                                    { nome: "Livros", total: estatisticas.totalLivros },
                                    { nome: "Mangás", total: estatisticas.totalMangas },
                                    { nome: "Séries", total: estatisticas.totalSeries },
                                    { nome: "Filmes", total: estatisticas.totalFilmes },
                                    { nome: "Jogos", total: estatisticas.totalJogos }
                                ].map(item => (

                                    <div
                                        className="perfil-categoria"
                                        key={item.nome}
                                    >

                                        <span>{item.nome}</span>

                                        <progress
                                            max={Math.max(
                                                estatisticas.totalObras, 1
                                            )}
                                            value={item.total}
                                            aria-label={item.nome}
                                        />

                                        <strong>{item.total}</strong>

                                    </div>

                                ))}

                            </div>

                        </>

                    )}

                </section>

                {/* CONFIGURAÇÕES */}

                <section className="perfil-card">

                    <span className="perfil-etiqueta">
                        ✳ MINHA IDENTIDADE
                    </span>

                    <h2>Configurações pessoais</h2>

                    <button
                        type="button"
                        className="perfil-opcao"
                        aria-expanded={secao === "dados"}
                        onClick={() => abrirSecao("dados")}
                    >
                        Informações pessoais
                        <span>{secao === "dados" ? "−" : "+"}</span>
                    </button>

                    {secao === "dados" && (

                        <form
                            className="perfil-form"
                            onSubmit={salvarDados}
                        >

                            <label>
                                Nome completo
                                <input
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                E-mail
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </label>

                            <button className="perfil-botao">
                                Salvar informações
                            </button>

                        </form>

                    )}

                    <button
                        type="button"
                        className="perfil-opcao"
                        aria-expanded={secao === "username"}
                        onClick={() => abrirSecao("username")}
                    >
                        Alterar nome de usuário
                        <span>{secao === "username" ? "−" : "+"}</span>
                    </button>

                    {secao === "username" && (

                        <form
                            className="perfil-form"
                            onSubmit={salvarUsername}
                        >

                            <label>
                                Novo username
                                <input
                                    value={novoUsername}
                                    onChange={e => setNovoUsername(e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                Senha atual
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    value={senhaAtual}
                                    onChange={e => setSenhaAtual(e.target.value)}
                                    required
                                />
                            </label>

                            <small>
                                Será necessário entrar novamente.
                            </small>

                            <button className="perfil-botao">
                                Alterar username
                            </button>

                        </form>

                    )}

                    <button
                        type="button"
                        className="perfil-opcao"
                        aria-expanded={secao === "senha"}
                        onClick={() => abrirSecao("senha")}
                    >
                        Alterar senha
                        <span>{secao === "senha" ? "−" : "+"}</span>
                    </button>

                    {secao === "senha" && (

                        <form
                            className="perfil-form"
                            onSubmit={salvarSenha}
                        >

                            <label>
                                Senha atual
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    value={senhaAtual}
                                    onChange={e => setSenhaAtual(e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                Nova senha
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    value={novaSenha}
                                    onChange={e => setNovaSenha(e.target.value)}
                                    minLength={8}
                                    required
                                />
                            </label>

                            <label>
                                Confirmar nova senha
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    value={confirmarSenha}
                                    onChange={e => setConfirmarSenha(e.target.value)}
                                    minLength={8}
                                    required
                                />
                            </label>

                            <small>
                                A nova senha deve possuir pelo menos
                                oito caracteres.
                            </small>

                            <button className="perfil-botao">
                                Alterar senha
                            </button>

                        </form>

                    )}

                </section>

                {/* EXCLUSÃO DA CONTA */}

                <section className="perfil-card perfil-perigo">

                    <span className="perfil-etiqueta">
                        ⚠ ZONA DE PERIGO
                    </span>

                    <h2>Excluir minha conta</h2>

                    <p>
                        Todas as suas histórias e informações
                        pessoais serão excluídas permanentemente.
                        Esta ação não poderá ser desfeita.
                    </p>

                    <button
                        type="button"
                        className="perfil-botao-perigo"
                        aria-expanded={secao === "excluir"}
                        onClick={() => abrirSecao("excluir")}
                    >
                        {secao === "excluir"
                            ? "Cancelar exclusão"
                            : "Excluir minha conta"}
                    </button>

                    {secao === "excluir" && (

                        <form
                            className="perfil-form"
                            onSubmit={apagarConta}
                        >

                            <label>
                                Senha atual
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    value={senhaAtual}
                                    onChange={e => setSenhaAtual(e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                Digite EXCLUIR para confirmar
                                <input
                                    value={confirmacao}
                                    onChange={e => setConfirmacao(e.target.value)}
                                    autoComplete="off"
                                    required
                                />
                            </label>

                            <button
                                className="perfil-botao-perigo"
                                disabled={confirmacao !== "EXCLUIR"}
                            >
                                Excluir definitivamente
                            </button>

                        </form>

                    )}

                </section>

            </fieldset>

            {carregando && (
                <p role="status">Processando operação...</p>
            )}

        </div>
    );
}

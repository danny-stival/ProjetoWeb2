
import { useEffect, useRef, useState } from "react";

import Avatar from "./Avatar";
import type { Perfil } from "../../types/Perfil";

import "./Perfil.css";

interface MenuUsuarioProps {
    perfil: Perfil;
    fotoUrl: string | null;
    onAbrirPerfil: () => void;
    onAbrirBiblioteca: () => void;
    onSair: () => void;
}

export default function MenuUsuario({
                                        perfil,
                                        fotoUrl,
                                        onAbrirPerfil,
                                        onAbrirBiblioteca,
                                        onSair
                                    }: MenuUsuarioProps) {

    const [aberto, setAberto] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const botaoRef = useRef<HTMLButtonElement>(null);

    const primeiroNome =
        perfil.nome.trim().split(/\s+/)[0]
        || perfil.username;

    useEffect(() => {

        if (!aberto) return;

        function fecharAoClicarFora(event: MouseEvent) {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setAberto(false);
            }
        }

        function fecharComEsc(event: KeyboardEvent) {

            if (event.key === "Escape") {
                setAberto(false);
                botaoRef.current?.focus();
            }
        }

        document.addEventListener(
            "mousedown",
            fecharAoClicarFora
        );

        document.addEventListener(
            "keydown",
            fecharComEsc
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                fecharAoClicarFora
            );

            document.removeEventListener(
                "keydown",
                fecharComEsc
            );
        };

    }, [aberto]);

    function executarAcao(acao: () => void) {

        setAberto(false);
        acao();
    }

    return (

        <div
            className="menu-usuario"
            ref={menuRef}
        >

            <button
                ref={botaoRef}
                type="button"
                className="menu-usuario-botao"
                onClick={() => setAberto(!aberto)}
                aria-expanded={aberto}
                aria-controls="menu-usuario-opcoes"
                aria-label="Abrir opções da conta"
            >

                <Avatar
                    nome={perfil.nome}
                    fotoUrl={fotoUrl}
                    tamanho="pequeno"
                />

                <span className="menu-usuario-nome">
                    {primeiroNome}
                </span>

                <span
                    className={`menu-usuario-seta ${
                        aberto ? "menu-seta-aberta" : ""
                    }`}
                    aria-hidden="true"
                >
                    ▾
                </span>

            </button>

            {aberto && (

                <div
                    className="menu-usuario-dropdown"
                    id="menu-usuario-opcoes"
                >

                    <div className="menu-usuario-identidade">

                        <Avatar
                            nome={perfil.nome}
                            fotoUrl={fotoUrl}
                            tamanho="medio"
                        />

                        <div className="menu-usuario-dados">

                            <strong>{perfil.nome}</strong>

                            <span>
                                @{perfil.username}
                            </span>

                        </div>

                    </div>

                    <div className="menu-usuario-divisor" />

                    <button
                        type="button"
                        className="menu-usuario-opcao"
                        onClick={() =>
                            executarAcao(onAbrirPerfil)
                        }
                    >
                        <span aria-hidden="true">✳</span>
                        Meu perfil
                    </button>

                    <button
                        type="button"
                        className="menu-usuario-opcao"
                        onClick={() =>
                            executarAcao(onAbrirBiblioteca)
                        }
                    >
                        <span aria-hidden="true">▤</span>
                        Minha biblioteca
                    </button>

                    <div className="menu-usuario-divisor" />

                    <button
                        type="button"
                        className="menu-usuario-opcao menu-usuario-sair"
                        onClick={() =>
                            executarAcao(onSair)
                        }
                    >
                        <span aria-hidden="true">↪</span>
                        Sair da conta
                    </button>

                </div>
            )}

        </div>
    );
}

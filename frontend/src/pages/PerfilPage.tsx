import { useNavigate } from "react-router-dom";

import Perfil from "../components/Perfil/Perfil";

import type { Perfil as PerfilDados } from "../types/Perfil";

interface PerfilPageProps {
    perfil: PerfilDados | null;
    fotoUrl: string | null;
    onAtualizar: () => void;
    onSair: () => void;
}

export default function PerfilPage({
                                       perfil,
                                       fotoUrl,
                                       onAtualizar,
                                       onSair
                                   }: PerfilPageProps) {

    const navigate = useNavigate();

    return (

        <>

            <button
                type="button"
                className="botao-voltar-biblioteca"
                onClick={() => navigate("/biblioteca")}
            >
                ← Voltar à biblioteca
            </button>

            <section className="boas-vindas">

                <span className="etiqueta">
                    EST. 2026 — IDENTIDADE PESSOAL
                </span>

                <h2>Ficha do colecionador</h2>

                <p>
                    Cada história faz parte da sua própria história.
                </p>

            </section>

            {perfil ? (

                <Perfil
                    perfil={perfil}
                    fotoUrl={fotoUrl}
                    onAtualizar={onAtualizar}
                    onSair={onSair}
                />

            ) : (

                <p>Aguardando os dados do perfil...</p>

            )}

        </>
    );
}
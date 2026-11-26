import { useState } from "react";
import "./Perfil.css";

interface AvatarProps {
    nome: string;
    fotoUrl?: string | null;
    tamanho?: "pequeno" | "medio" | "grande";
}

function obterIniciais(nome: string): string {

    const partes = nome.trim().split(/\s+/).filter(Boolean);

    if (partes.length === 0) {
        return "?";
    }

    if (partes.length === 1) {
        return partes[0].charAt(0).toUpperCase();
    }

    return (
        partes[0].charAt(0) +
        partes[partes.length - 1].charAt(0)
    ).toUpperCase();
}

export default function Avatar({
                                   nome,
                                   fotoUrl = null,
                                   tamanho = "medio"
                               }: AvatarProps) {

    const [fotoComErro, setFotoComErro] =
        useState<string | null>(null);

    const exibirFoto =
        fotoUrl && fotoComErro !== fotoUrl;

    return (

        <div
            className={`avatar avatar-${tamanho}`}
            role="img"
            aria-label={`Avatar de ${nome}`}
        >

            {exibirFoto ? (

                <img
                    src={fotoUrl}
                    alt=""
                    className="avatar-imagem"
                    onError={() => setFotoComErro(fotoUrl)}
                />

            ) : (

                <span className="avatar-iniciais">
                    {obterIniciais(nome)}
                </span>

            )}

        </div>
    );
}

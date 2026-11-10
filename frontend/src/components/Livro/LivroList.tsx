// src/components/LivroList.tsx
import { useState, useEffect } from "react";
import api from "../../services/api.ts";
import type { Livro } from "../../types/Livro.ts";
import LivroItem from "./LivroItem.tsx";

function LivroList() {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        api
            .get<Livro[]>("/livros")
            .then((resposta) => {
                setLivros(resposta.data);
            })
            .catch((err) => {
                console.error(err);
                setErro("Não carregou os livros.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Carregando livros...</p>;
    if (erro) return <p style={{ color: "red" }}>{erro}</p>;

    return (
        <ul>
            {livros.map((livro) => (
                <LivroItem key={livro.id} livro={livro} />
            ))}
        </ul>
    );
}

export default LivroList;
// src/components/Livro/LivroForm.tsx
import { useState } from "react";
import api from "../../services/api";
import type { Livro } from "../../types/Livro";

interface LivroFormProps {
    onLivroSalvo: () => void;
    livroEditando?: Livro | null;
}

function LivroForm({ onLivroSalvo, livroEditando }: LivroFormProps) {
    const [nome, setNome] = useState(livroEditando?.nome ?? "");
    const [autor, setAutor] = useState(livroEditando?.autor ?? "");
    const [editora, setEditora] = useState(livroEditando?.editora ?? "");
    const [paginas, setPaginas] = useState(livroEditando?.paginas ?? 0);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const dados = { nome, autor, editora, paginas };

        try {
            if (livroEditando) {
                await api.put(`/livros/${livroEditando.id}`, dados);
            } else {
                await api.post("/livros", dados);
            }
            onLivroSalvo();
        } catch (err: any) {
            console.error(err);
            const mensagem =
                err?.response?.data?.message ?? "Erro salvar usuário";
            alert(mensagem);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                required
            />
            <input
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Autor"
                required
            />
            <input
                value={editora}
                onChange={(e) => setEditora(e.target.value)}
                placeholder="Editora"
                required
            />
            <input
                type="number"
                value={paginas}
                onChange={(e) => setPaginas(Number(e.target.value))}
                placeholder="Páginas"
                required
            />
            <button type="submit">
                {livroEditando ? "Salvar alterações" : "Cadastrar"}
            </button>
        </form>
    );
}

export default LivroForm;
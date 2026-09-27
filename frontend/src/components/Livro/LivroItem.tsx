// src/components/LivroItem.tsx
import type { Livro } from "../../types/Livro.ts";

interface LivroItemProps {
    livro: Livro;
}

function LivroItem({ livro }: LivroItemProps) {
    return (
        <li>
            <strong>{livro.nome}</strong> — {livro.autor} ({livro.editora}, {livro.paginas} págs.)
        </li>
    );
}

export default LivroItem;
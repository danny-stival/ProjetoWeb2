// src/components/PermissaoItem.tsx
import type { Permissao } from "../../types/Permissao.ts";

interface PermissaoItemProps {
    permissao: Permissao;
}

function PermissaoItem({ permissao }: PermissaoItemProps) {
    return (
        <li>
            <strong>{permissao.nome}</strong> — {permissao.descricao}
        </li>
    );
}

export default PermissaoItem;
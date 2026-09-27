// src/components/PermissaoList.tsx
import { useState, useEffect } from "react";
import api from "../../services/api.ts";
import type { Permissao } from "../../types/Permissao.ts";
import PermissaoItem from "./PermissaoItem.tsx";

function PermissaoList() {
    const [permissoes, setPermissoes] = useState<Permissao[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        api
            .get<Permissao[]>("/permissoes")
            .then((resposta) => {
                setPermissoes(resposta.data);
            })
            .catch((err) => {
                console.error(err);
                setErro("Não foi possível carregar as permissões.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Carregando permissões...</p>;
    if (erro) return <p style={{ color: "red" }}>{erro}</p>;

    return (
        <ul>
            {permissoes.map((permissao) => (
                <PermissaoItem key={permissao.id} permissao={permissao} />
            ))}
        </ul>
    );
}

export default PermissaoList;
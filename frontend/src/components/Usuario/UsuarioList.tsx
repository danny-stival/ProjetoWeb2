// src/components/UsuarioList.tsx
import { useState, useEffect } from "react";
import api from "../../services/api.ts";
import type { Usuario } from "../../types/Usuario.ts";
import UsuarioItem from "./UsuarioItem.tsx";
import UsuarioForm from "./UsuarioForm.tsx";

function UsuarioList() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [editando, setEditando] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    function carregarUsuarios() {
        setLoading(true);
        api
            .get<Usuario[]>("/usuarios")
            .then((resposta) => setUsuarios(resposta.data))
            .catch((err) => {
                console.error(err);
                setErro("Não foi possível carregar os usuários.");
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function excluir(id: number) {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        try {
            await api.delete(`/usuarios/${id}`);
            carregarUsuarios();
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir usuário");
        }
    }

    function handleSalvo() {
        carregarUsuarios();
        setEditando(null);
    }

    if (loading) return <p>Carregando...</p>;
    if (erro) return <p style={{ color: "red" }}>{erro}</p>;

    return (
        <div>
            <UsuarioForm
                key={editando?.id ?? "novo"}
                usuarioEditando={editando}
                onUsuarioSalvo={handleSalvo}
            />

            {editando && (
                <button onClick={() => setEditando(null)}>Cancelar edição</button>
            )}

            <ul style={{ listStyle: "none", padding: 0 }}>
                {usuarios.map((usuario) => (
                    <li key={usuario.id} style={{ marginBottom: "8px" }}>
                        <UsuarioItem usuario={usuario} />{" "}
                        <button onClick={() => setEditando(usuario)}>Editar</button>{" "}
                        <button onClick={() => excluir(usuario.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UsuarioList;
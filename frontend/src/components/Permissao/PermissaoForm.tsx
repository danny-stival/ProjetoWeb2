// src/components/Permissao/PermissaoForm.tsx
import { useState } from "react";
import api from "../../services/api";
import type { Permissao } from "../../types/Permissao";

interface PermissaoFormProps {
  onPermissaoSalva: () => void;
  permissaoEditando?: Permissao | null;
}

function PermissaoForm({ onPermissaoSalva, permissaoEditando }: PermissaoFormProps) {
  const [nome, setNome] = useState(permissaoEditando?.nome ?? "");
  const [descricao, setDescricao] = useState(permissaoEditando?.descricao ?? "");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const dados = { nome, descricao };

    try {
      if (permissaoEditando) {
        await api.put(`/permissoes/${permissaoEditando.id}`, dados);
      } else {
        await api.post("/permissoes", dados);
      }
      onPermissaoSalva();
    } catch (err: any) {
        console.error(err);
        const mensagem =
            err?.response?.data?.message ?? "Erro ao salvar usuário";
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
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            required
        />
        <button type="submit">
          {permissaoEditando ? "Salvar alterações" : "Cadastrar"}
        </button>
      </form>
  );
}

export default PermissaoForm;
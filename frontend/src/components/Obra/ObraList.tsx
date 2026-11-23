
import { useEffect, useState } from "react";
import { listarObras } from "../../services/obraService";
import type { Obra } from "../../types/Obra";

// Define a propriedade que o componente recebe do App.tsx
interface ObraListProps {
    atualizar: number;
}

export default function ObraList({ atualizar }: ObraListProps) {

    const [obras, setObras] = useState<Obra[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarObras() {
            setCarregando(true);
            setErro("");

            try {
                const dados = await listarObras();
                setObras(dados);
            } catch {
                setErro("Não foi possível carregar suas obras.");
            } finally {
                setCarregando(false);
            }
        }

        carregarObras();
    }, [atualizar]);

    if (carregando) {
        return <p>Carregando suas histórias...</p>;
    }

    if (erro) {
        return <p role="alert">{erro}</p>;
    }

    if (obras.length === 0) {
        return <p>Você ainda não cadastrou nenhuma obra.</p>;
    }

    return (
        <div>
            <h2>Minhas obras</h2>

            {obras.map((obra) => (
                <div key={obra.id}>
                    <h3>{obra.titulo}</h3>

                    <p>Tipo: {obra.tipo}</p>
                    <p>Status: {obra.status.replaceAll("_", " ")}</p>

                    {obra.criador && (
                        <p>Criador: {obra.criador}</p>
                    )}

                    <hr />
                </div>
            ))}
        </div>
    );
}

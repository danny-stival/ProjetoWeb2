import type { Resenha } from "../../types/Resenha";

interface ResenhaItemProps {
    resenha: Resenha;
    onEditar: (resenha: Resenha) => void;
    onExcluir: (id: number) => void;
    excluindo: boolean;
}

export default function ResenhaItem({
                                        resenha,
                                        onEditar,
                                        onExcluir,
                                        excluindo
                                    }: ResenhaItemProps) {

    return (

        <article className="resenha-card">

        <div className="resenha-card-topo">

        <span className="resenha-obra">
            {resenha.obraTitulo}
            </span>

            <span
    className="resenha-nota"
    aria-label={`${resenha.nota} de 5 estrelas`}
>
    {"★".repeat(resenha.nota)}
    {"☆".repeat(5 - resenha.nota)}
    </span>

    </div>

    <h2>{resenha.titulo}</h2>

    <small className="resenha-data">
        {new Date(
                resenha.dataCriacao
            ).toLocaleDateString("pt-BR")}
        </small>

        <p className="resenha-comentario">
        {resenha.comentario}
        </p>

        <div className="resenha-acoes">

    <button
        type="button"
    className="resenha-botao-secundario"
    onClick={() => onEditar(resenha)}
    disabled={excluindo}
        >
        Editar
        </button>

        <button
    type="button"
    className="resenha-botao-excluir"
    onClick={() => onExcluir(resenha.id)}
    disabled={excluindo}
        >
        {excluindo ? "Excluindo..." : "Excluir"}
        </button>

        </div>

        </article>
);
}
package br.ueg.trindade.danyella_web2_fullstack.repository;

import br.ueg.trindade.danyella_web2_fullstack.model.Obra;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EstatisticasRepository
        extends Repository<Obra, Long> {

    @Query("""
            SELECT o.status, COUNT(o)
            FROM Obra o
            WHERE o.usuario.id = :usuarioId
            GROUP BY o.status
            """)
    List<Object[]> contarPorStatus(
            @Param("usuarioId") Long usuarioId
    );

    @Query("""
            SELECT o.tipo, COUNT(o)
            FROM Obra o
            WHERE o.usuario.id = :usuarioId
            GROUP BY o.tipo
            """)
    List<Object[]> contarPorTipo(
            @Param("usuarioId") Long usuarioId
    );
}
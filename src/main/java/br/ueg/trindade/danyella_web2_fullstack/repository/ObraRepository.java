package br.ueg.trindade.danyella_web2_fullstack.repository;

import br.ueg.trindade.danyella_web2_fullstack.model.Obra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ObraRepository
        extends JpaRepository<Obra, Long> {

    List<Obra> findAllByUsuario_Id(Long usuarioId);

    Optional<Obra> findByIdAndUsuario_Id(
            Long id,
            Long usuarioId
    );

    @Modifying
    @Query("""
            DELETE FROM Obra o
            WHERE o.usuario.id = :usuarioId
            """)
    void excluirTodasPorUsuario(
            @Param("usuarioId") Long usuarioId
    );
}

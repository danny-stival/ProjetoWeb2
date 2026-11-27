package br.ueg.trindade.danyella_web2_fullstack.repository;

import br.ueg.trindade.danyella_web2_fullstack.model.Resenha;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResenhaRepository
        extends JpaRepository<Resenha, Long> {

    List<Resenha>
    findAllByObra_Usuario_IdOrderByDataCriacaoDesc(
            Long usuarioId
    );

    Optional<Resenha> findByIdAndObra_Usuario_Id(
            Long id,
            Long usuarioId
    );
}
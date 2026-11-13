
package br.ueg.trindade.danyella_web2_fullstack.repository;

import br.ueg.trindade.danyella_web2_fullstack.model.Obra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ObraRepository extends JpaRepository<Obra, Long> {

    List<Obra> findAllByUsuario_Id(Long usuarioId); //obra por usuairo

    Optional<Obra> findByIdAndUsuario_Id(Long id, Long usuarioId);//obra p id do usuaior

}

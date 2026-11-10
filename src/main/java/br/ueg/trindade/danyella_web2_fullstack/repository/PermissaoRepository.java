package br.ueg.trindade.danyella_web2_fullstack.Repository;

import br.ueg.trindade.danyella_web2_fullstack.Model.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {

    Optional<Permissao> findByNome(String nome);

    boolean existsByNomeAndIdNot(String nome, Long id);
}
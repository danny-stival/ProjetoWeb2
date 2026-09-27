package br.ueg.trindade.danyella_web2_fullstack.Repository;

import br.ueg.trindade.danyella_web2_fullstack.Model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LivroRepository extends JpaRepository<Livro, Long> {

    Optional<Livro> findByNomeAndAutor(String nome, String autor);

    boolean existsByNomeAndAutorAndIdNot(String nome, String autor, Long id);
}
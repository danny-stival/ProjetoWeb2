package br.ueg.trindade.danyella_web2_fullstack.service;

import br.ueg.trindade.danyella_web2_fullstack.model.Livro;
import br.ueg.trindade.danyella_web2_fullstack.repository.LivroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final LivroRepository livroRepository;

    public List<Livro> listar() {
        return livroRepository.findAll();
    }

    public Livro buscarPorId(Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
    }

    public Livro criar(Livro livro) {
        if (livroRepository.findByNomeAndAutor(livro.getNome(), livro.getAutor()).isPresent()) {
            throw new RuntimeException("Já existe um livro com esse nome e autor");
        }
        return livroRepository.save(livro);
    }

    public Livro atualizar(Long id, Livro livroAtualizado) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        if (livroRepository.existsByNomeAndAutorAndIdNot(
                livroAtualizado.getNome(),
                livroAtualizado.getAutor(),
                id)) {
            throw new RuntimeException("Já existe outro livro com esse nome e autor");
        }

        livro.setNome(livroAtualizado.getNome());
        livro.setAutor(livroAtualizado.getAutor());
        livro.setEditora(livroAtualizado.getEditora());
        livro.setPaginas(livroAtualizado.getPaginas());

        return livroRepository.save(livro);
    }

    public void deletar(Long id) {
        if (!livroRepository.existsById(id)) {
            throw new RuntimeException("Livro não encontrado");
        }
        livroRepository.deleteById(id);
    }
}
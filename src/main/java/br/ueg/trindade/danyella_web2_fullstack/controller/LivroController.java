package br.ueg.trindade.danyella_web2_fullstack.Controller;

import br.ueg.trindade.danyella_web2_fullstack.Model.Livro;
import br.ueg.trindade.danyella_web2_fullstack.Repository.LivroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LivroController {

    private final LivroRepository livroRepository;

    // CREATE
    @PostMapping("/livros")
    public Livro criar(@RequestBody Livro livro) {
        return livroRepository.save(livro);
    }

    // READ — todos
    @GetMapping("/livros")
    public List<Livro> listar() {
        return livroRepository.findAll();
    }

    // READ — por id
    @GetMapping("/livros/{id}")
    public Livro buscarPorId(@PathVariable Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
    }

    // UPDATE
    @PutMapping("/livros/{id}")
    public Livro atualizar(@PathVariable Long id, @RequestBody Livro livroAtualizado) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        livro.setNome(livroAtualizado.getNome());
        livro.setAutor(livroAtualizado.getAutor());
        livro.setEditora(livroAtualizado.getEditora());
        livro.setPaginas(livroAtualizado.getPaginas());

        return livroRepository.save(livro);
    }

    // DELETE
    @DeleteMapping("/livros/{id}")
    public void deletar(@PathVariable Long id) {
        if (!livroRepository.existsById(id)) {
            throw new RuntimeException("Livro não encontrado");
        }
        livroRepository.deleteById(id);
    }
}
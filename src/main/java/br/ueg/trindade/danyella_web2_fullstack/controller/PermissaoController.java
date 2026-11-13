package br.ueg.trindade.danyella_web2_fullstack.controller;

import br.ueg.trindade.danyella_web2_fullstack.model.Permissao;
import br.ueg.trindade.danyella_web2_fullstack.service.PermissaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PermissaoController {

    private final PermissaoService permissaoService;

    @PostMapping("/permissoes")
    public Permissao criar(@RequestBody Permissao permissao) {
        return permissaoService.criar(permissao);
    }

    @GetMapping("/permissoes")
    public List<Permissao> listar() {
        return permissaoService.listar();
    }

    @GetMapping("/permissoes/{id}")
    public Permissao buscarPorId(@PathVariable Long id) {
        return permissaoService.buscarPorId(id);
    }

    @PutMapping("/permissoes/{id}")
    public Permissao atualizar(@PathVariable Long id, @RequestBody Permissao permissao) {
        return permissaoService.atualizar(id, permissao);
    }

    @DeleteMapping("/permissoes/{id}")
    public void deletar(@PathVariable Long id) {
        permissaoService.deletar(id);
    }
}
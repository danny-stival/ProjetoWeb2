package br.ueg.trindade.danyella_web2_fullstack;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@GetMapping("/api")
public class Permissao {
    GetMapping("/permissao");

    Long id;
    String nome;
    String descricao;

}

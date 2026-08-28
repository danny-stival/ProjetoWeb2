package br.ueg.trindade.danyella_web2_fullstack;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
public class UsuarioController {
    @GetMapping("/usuarios")
    public List getAllUsuarios() {
        List users = new ArrayList<>();
        users.add(Map.of("nome","João","username","joao123"));
        users.add(Map.of("nome","Maria","username","maria456"));

        return users;
    }
}
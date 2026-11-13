package br.ueg.trindade.danyella_web2_fullstack.controller;

import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/usuarios")
    public UsuarioDTO criarUsuario(@RequestBody UsuarioRequestDTO dto) {
        return usuarioService.criar(dto);
    }

    @GetMapping("/usuarios")
    public List<UsuarioDTO> listarUsuarios() {
        return usuarioService.listar();
    }

    @GetMapping("/usuarios/{id}")
    public UsuarioDTO buscarUsuarioPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @PutMapping("/usuarios/{id}")
    public UsuarioDTO atualizarUsuario(@PathVariable Long id,
                                       @RequestBody UsuarioRequestDTO dto) {
        return usuarioService.atualizar(id, dto);
    }

    @DeleteMapping("/usuarios/{id}")
    public void deletarUsuario(@PathVariable Long id) {
        usuarioService.deletar(id);
    }
}
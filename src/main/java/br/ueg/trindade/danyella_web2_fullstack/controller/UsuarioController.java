package br.ueg.trindade.danyella_web2_fullstack.controller;

import br.ueg.trindade.danyella_web2_fullstack.DTO.AlterarSenhaDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.AlterarUsernameDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.ExcluirContaDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.PerfilRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioDTO;

import br.ueg.trindade.danyella_web2_fullstack.security.UsuarioAutenticado;
import br.ueg.trindade.danyella_web2_fullstack.service.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/me")
    public UsuarioDTO consultarPerfil(
            @AuthenticationPrincipal UsuarioAutenticado usuario
    ) {

        return usuarioService.consultarPerfil(
                usuario.getId()
        );
    }

    @PutMapping("/me")
    public UsuarioDTO atualizarPerfil(
            @AuthenticationPrincipal UsuarioAutenticado usuario,
            @Valid @RequestBody PerfilRequestDTO dto
    ) {

        return usuarioService.atualizarPerfil(
                usuario.getId(),
                dto
        );
    }

    @PutMapping("/me/username")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void alterarUsername(
            @AuthenticationPrincipal UsuarioAutenticado usuario,
            @Valid @RequestBody AlterarUsernameDTO dto
    ) {

        usuarioService.alterarUsername(
                usuario.getId(),
                dto
        );
    }

    @PutMapping("/me/senha")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void alterarSenha(
            @AuthenticationPrincipal UsuarioAutenticado usuario,
            @Valid @RequestBody AlterarSenhaDTO dto
    ) {

        usuarioService.alterarSenha(
                usuario.getId(),
                dto
        );
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirConta(
            @AuthenticationPrincipal UsuarioAutenticado usuario,
            @Valid @RequestBody ExcluirContaDTO dto
    ) {

        usuarioService.excluirConta(
                usuario.getId(),
                dto
        );
    }
}

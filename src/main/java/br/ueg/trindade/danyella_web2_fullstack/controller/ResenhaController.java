package br.ueg.trindade.danyella_web2_fullstack.controller;

import br.ueg.trindade.danyella_web2_fullstack.DTO.ResenhaRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.ResenhaResponseDTO;

import br.ueg.trindade.danyella_web2_fullstack.security.UsuarioAutenticado;
import br.ueg.trindade.danyella_web2_fullstack.service.ResenhaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenhas")
@RequiredArgsConstructor
public class ResenhaController {

    private final ResenhaService resenhaService;

    @GetMapping
    public List<ResenhaResponseDTO> listar(
            @AuthenticationPrincipal
            UsuarioAutenticado usuario
    ) {

        return resenhaService.listar(usuario.getId());
    }

    @GetMapping("/{id}")
    public ResenhaResponseDTO buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal
            UsuarioAutenticado usuario
    ) {

        return resenhaService.buscarPorId(
                id,
                usuario.getId()
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResenhaResponseDTO cadastrar(
            @Valid @RequestBody ResenhaRequestDTO dto,
            @AuthenticationPrincipal
            UsuarioAutenticado usuario
    ) {

        return resenhaService.cadastrar(
                dto,
                usuario.getId()
        );
    }

    @PutMapping("/{id}")
    public ResenhaResponseDTO atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ResenhaRequestDTO dto,
            @AuthenticationPrincipal
            UsuarioAutenticado usuario
    ) {

        return resenhaService.atualizar(
                id,
                dto,
                usuario.getId()
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
            @PathVariable Long id,
            @AuthenticationPrincipal
            UsuarioAutenticado usuario
    ) {

        resenhaService.excluir(
                id,
                usuario.getId()
        );
    }
}
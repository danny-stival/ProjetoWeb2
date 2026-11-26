package br.ueg.trindade.danyella_web2_fullstack.controller;
import br.ueg.trindade.danyella_web2_fullstack.DTO.FotoPerfilDTO;
import br.ueg.trindade.danyella_web2_fullstack.security.UsuarioAutenticado;
import br.ueg.trindade.danyella_web2_fullstack.service.FotoPerfilService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/usuarios/me/foto")
@RequiredArgsConstructor
public class FotoPerfilController {

    private final FotoPerfilService fotoPerfilService;

    @GetMapping
    public ResponseEntity<byte[]> consultarFoto(
            @AuthenticationPrincipal UsuarioAutenticado usuario
    ) {

        FotoPerfilDTO foto = fotoPerfilService.consultarFoto(
                usuario.getId()
        );

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                foto.getContentType()
                        )
                )
                .header(
                        HttpHeaders.CACHE_CONTROL,
                        "no-store"
                )
                .header(
                        "X-Content-Type-Options",
                        "nosniff"
                )
                .body(foto.getImagem());
    }

    @PutMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarFoto(
            @AuthenticationPrincipal UsuarioAutenticado usuario,
            @RequestParam("arquivo") MultipartFile arquivo
    ) {

        fotoPerfilService.atualizarFoto(
                usuario.getId(),
                arquivo
        );
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerFoto(
            @AuthenticationPrincipal UsuarioAutenticado usuario
    ) {

        fotoPerfilService.removerFoto(
                usuario.getId()
        );
    }
}

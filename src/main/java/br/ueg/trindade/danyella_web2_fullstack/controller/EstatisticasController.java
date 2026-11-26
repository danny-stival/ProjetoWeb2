package br.ueg.trindade.danyella_web2_fullstack.controller;

import br.ueg.trindade.danyella_web2_fullstack.DTO.EstatisticasDTO;
import br.ueg.trindade.danyella_web2_fullstack.security.UsuarioAutenticado;
import br.ueg.trindade.danyella_web2_fullstack.service.EstatisticasService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios/me/estatisticas")
@RequiredArgsConstructor
public class EstatisticasController {

    private final EstatisticasService estatisticasService;

    @GetMapping
    public EstatisticasDTO consultarEstatisticas(
            @AuthenticationPrincipal UsuarioAutenticado usuario
    ) {

        return estatisticasService.consultarEstatisticas(
                usuario.getId()
        );
    }
}
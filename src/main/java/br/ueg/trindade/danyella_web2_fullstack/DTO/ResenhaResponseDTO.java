package br.ueg.trindade.danyella_web2_fullstack.DTO;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ResenhaResponseDTO {

    private Long id;

    private Long obraId;

    private String obraTitulo;

    private String titulo;

    private String comentario;

    private Integer nota;

    private LocalDateTime dataCriacao;
}
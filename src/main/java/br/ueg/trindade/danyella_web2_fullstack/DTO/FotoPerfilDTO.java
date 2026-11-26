package br.ueg.trindade.danyella_web2_fullstack.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FotoPerfilDTO {

    private byte[] imagem;
    private String contentType;
}
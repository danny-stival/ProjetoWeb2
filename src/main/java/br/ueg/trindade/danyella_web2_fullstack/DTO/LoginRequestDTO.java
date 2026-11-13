package br.ueg.trindade.danyella_web2_fullstack.DTO;

import lombok.Data;

@Data
public class LoginRequestDTO {

    private String username;
    private String senha;
}
package br.ueg.trindade.danyella_web2_fullstack.DTO;

import lombok.Data;

@Data
public class UsuarioRequestDTO {
    private String nome;
    private String username;
    private String email;
    private String senha;
}

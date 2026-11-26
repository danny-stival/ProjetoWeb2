package br.ueg.trindade.danyella_web2_fullstack.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AlterarUsernameDTO {

    @NotBlank(message = "Informe o novo nome de usuário.")
    private String novoUsername;

    @NotBlank(message = "Informe sua senha atual.")
    private String senhaAtual;
}
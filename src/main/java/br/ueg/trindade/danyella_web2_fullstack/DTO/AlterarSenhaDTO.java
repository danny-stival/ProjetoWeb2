package br.ueg.trindade.danyella_web2_fullstack.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AlterarSenhaDTO {

    @NotBlank(message = "Informe sua senha atual.")
    private String senhaAtual;

    @NotBlank(message = "Informe a nova senha.")
    @Size(
            min = 8,
            message = "A nova senha deve possuir pelo menos 8 caracteres."
    )
    private String novaSenha;

    @NotBlank(message = "Confirme a nova senha.")
    private String confirmarSenha;
}
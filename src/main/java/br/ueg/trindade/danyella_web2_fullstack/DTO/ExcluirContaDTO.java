package br.ueg.trindade.danyella_web2_fullstack.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ExcluirContaDTO {

    @NotBlank(message = "Informe sua senha atual.")
    private String senhaAtual;

    @NotBlank(message = "Confirme a exclusão da conta.")
    private String confirmacao;
}
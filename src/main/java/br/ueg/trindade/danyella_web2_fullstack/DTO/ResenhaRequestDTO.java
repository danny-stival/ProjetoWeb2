package br.ueg.trindade.danyella_web2_fullstack.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ResenhaRequestDTO {

    @NotNull(message = "Selecione uma obra.")
    private Long obraId;

    @NotBlank(message = "Informe o título da resenha.")
    @Size(max = 150)
    private String titulo;

    @NotBlank(message = "Escreva sua resenha.")
    @Size(max = 5000)
    private String comentario;

    @NotNull(message = "Informe uma nota.")
    @Min(value = 1, message = "A nota mínima é 1.")
    @Max(value = 5, message = "A nota máxima é 5.")
    private Integer nota;
}
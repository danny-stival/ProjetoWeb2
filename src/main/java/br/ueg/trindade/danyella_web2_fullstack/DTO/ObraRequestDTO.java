
package br.ueg.trindade.danyella_web2_fullstack.DTO;

import br.ueg.trindade.danyella_web2_fullstack.model.enums.StatusObra;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.TipoObra;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ObraRequestDTO {

    @NotBlank(message = "O título é obrigatório.")
    private String titulo;

    private String criador;
    private String descricao;
    private String genero;

    @Min(value = 0, message = "O ano de lançamento está invalido.")
    private Integer anoLancamento;

    private String capaUrl;

    @NotNull(message = "O tipo da obra é obrigatório.")
    private TipoObra tipo;

    @NotNull(message = "O status da obra é obrigatório.")
    private StatusObra status;

    private LocalDate dataInicio;
    private LocalDate dataConclusao;

    @PositiveOrZero(message = "Quantidade invalida.")
    private Integer quantidadeTotal;

    @PositiveOrZero(message = "Progresso invalido.")
    private Integer progressoAtual;

    private String unidadeTotal;
}

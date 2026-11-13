package br.ueg.trindade.danyella_web2_fullstack.DTO;

import br.ueg.trindade.danyella_web2_fullstack.model.enums.StatusObra;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.TipoObra;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ObraRequestDTO {

    private String titulo;
    private String criador;
    private String descricao;
    private String genero;
    private Integer anoLancamento;
    private String capaUrl;

    private TipoObra tipo;
    private StatusObra status;

    private LocalDate dataInicio;
    private LocalDate dataConclusao;

    private Integer quantidadeTotal;
    private Integer progressoAtual;
    private String unidadeTotal;
}
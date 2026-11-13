package br.ueg.trindade.danyella_web2_fullstack.DTO;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.StatusObra;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.TipoObra;
import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class ObraResponseDTO {

        private Long id;
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


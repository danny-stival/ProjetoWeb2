package br.ueg.trindade.danyella_web2_fullstack.DTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EstatisticasDTO {

    private long totalObras;

    private long concluidas;
    private long emAndamento;
    private long listaDesejos;
    private long abandonadas;

    private long totalLivros;
    private long totalMangas;
    private long totalSeries;
    private long totalFilmes;
    private long totalJogos;

    private double taxaConclusao;
}
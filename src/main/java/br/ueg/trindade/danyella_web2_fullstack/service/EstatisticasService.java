package br.ueg.trindade.danyella_web2_fullstack.service;

import br.ueg.trindade.danyella_web2_fullstack.DTO.EstatisticasDTO;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.StatusObra;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.TipoObra;
import br.ueg.trindade.danyella_web2_fullstack.repository.EstatisticasRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EstatisticasService {

    private final EstatisticasRepository estatisticasRepository;

    @Transactional(readOnly = true)
    public EstatisticasDTO consultarEstatisticas(Long usuarioId) {

        Map<StatusObra, Long> status =
                new EnumMap<>(StatusObra.class);

        Map<TipoObra, Long> tipos =
                new EnumMap<>(TipoObra.class);

        // Agrupa as obras por status
        for (Object[] resultado :
                estatisticasRepository.contarPorStatus(usuarioId)) {

            status.put(
                    (StatusObra) resultado[0],
                    (Long) resultado[1]
            );
        }

        // Agrupa as obras por tipo
        for (Object[] resultado :
                estatisticasRepository.contarPorTipo(usuarioId)) {

            tipos.put(
                    (TipoObra) resultado[0],
                    (Long) resultado[1]
            );
        }

        long concluidas = status.getOrDefault(
                StatusObra.CONCLUIDO, 0L);

        long emAndamento = status.getOrDefault(
                StatusObra.EM_ANDAMENTO, 0L);

        long listaDesejos = status.getOrDefault(
                StatusObra.LISTA_DESEJOS, 0L);

        long abandonadas = status.getOrDefault(
                StatusObra.ABANDONADO, 0L);

        long totalObras = status.values()
                .stream()
                .mapToLong(Long::longValue)
                .sum();

        double taxaConclusao = calcularTaxaConclusao(
                concluidas, totalObras);

        return EstatisticasDTO.builder()
                .totalObras(totalObras)
                .concluidas(concluidas)
                .emAndamento(emAndamento)
                .listaDesejos(listaDesejos)
                .abandonadas(abandonadas)
                .totalLivros(tipos.getOrDefault(
                        TipoObra.LIVRO, 0L))
                .totalMangas(tipos.getOrDefault(
                        TipoObra.MANGA, 0L))
                .totalSeries(tipos.getOrDefault(
                        TipoObra.SERIE, 0L))
                .totalFilmes(tipos.getOrDefault(
                        TipoObra.FILME, 0L))
                .totalJogos(tipos.getOrDefault(
                        TipoObra.JOGO, 0L))
                .taxaConclusao(taxaConclusao)
                .build();
    }

    private double calcularTaxaConclusao(
            long concluidas,
            long totalObras
    ) {

        if (totalObras == 0) {
            return 0.0;
        }

        double taxa = (concluidas * 100.0) / totalObras;

        return Math.round(taxa * 100.0) / 100.0;
    }
}

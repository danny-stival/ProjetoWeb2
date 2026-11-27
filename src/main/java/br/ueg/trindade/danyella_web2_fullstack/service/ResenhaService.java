package br.ueg.trindade.danyella_web2_fullstack.service;

import br.ueg.trindade.danyella_web2_fullstack.DTO.ResenhaRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.ResenhaResponseDTO;

import br.ueg.trindade.danyella_web2_fullstack.model.Obra;
import br.ueg.trindade.danyella_web2_fullstack.model.Resenha;

import br.ueg.trindade.danyella_web2_fullstack.repository.ObraRepository;
import br.ueg.trindade.danyella_web2_fullstack.repository.ResenhaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResenhaService {

    private final ResenhaRepository resenhaRepository;
    private final ObraRepository obraRepository;

    @Transactional(readOnly = true)
    public List<ResenhaResponseDTO> listar(Long usuarioId) {

        return resenhaRepository
                .findAllByObra_Usuario_IdOrderByDataCriacaoDesc(
                        usuarioId
                )
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResenhaResponseDTO buscarPorId(
            Long id,
            Long usuarioId
    ) {

        return toDTO(obterResenha(id, usuarioId));
    }

    @Transactional
    public ResenhaResponseDTO cadastrar(
            ResenhaRequestDTO dto,
            Long usuarioId
    ) {

        Obra obra = obterObra(
                dto.getObraId(),
                usuarioId
        );

        Resenha resenha = Resenha.builder()
                .titulo(dto.getTitulo().trim())
                .comentario(dto.getComentario().trim())
                .nota(dto.getNota())
                .dataCriacao(LocalDateTime.now())
                .obra(obra)
                .build();

        return toDTO(
                resenhaRepository.save(resenha)
        );
    }

    @Transactional
    public ResenhaResponseDTO atualizar(
            Long id,
            ResenhaRequestDTO dto,
            Long usuarioId
    ) {

        Resenha resenha = obterResenha(id, usuarioId);

        Obra obra = obterObra(
                dto.getObraId(),
                usuarioId
        );

        resenha.setTitulo(dto.getTitulo().trim());
        resenha.setComentario(dto.getComentario().trim());
        resenha.setNota(dto.getNota());
        resenha.setObra(obra);

        return toDTO(
                resenhaRepository.save(resenha)
        );
    }

    @Transactional
    public void excluir(
            Long id,
            Long usuarioId
    ) {

        Resenha resenha = obterResenha(id, usuarioId);

        resenhaRepository.delete(resenha);
    }

    private Resenha obterResenha(
            Long id,
            Long usuarioId
    ) {

        return resenhaRepository
                .findByIdAndObra_Usuario_Id(id, usuarioId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Resenha não encontrada."
                        )
                );
    }

    private Obra obterObra(
            Long obraId,
            Long usuarioId
    ) {

        return obraRepository
                .findByIdAndUsuario_Id(obraId, usuarioId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Obra não encontrada."
                        )
                );
    }

    private ResenhaResponseDTO toDTO(Resenha resenha) {

        return ResenhaResponseDTO.builder()
                .id(resenha.getId())
                .obraId(resenha.getObra().getId())
                .obraTitulo(resenha.getObra().getTitulo())
                .titulo(resenha.getTitulo())
                .comentario(resenha.getComentario())
                .nota(resenha.getNota())
                .dataCriacao(resenha.getDataCriacao())
                .build();
    }
}
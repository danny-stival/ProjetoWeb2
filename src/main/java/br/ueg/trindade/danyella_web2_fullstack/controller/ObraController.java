package br.ueg.trindade.danyella_web2_fullstack.controller;

import br.ueg.trindade.danyella_web2_fullstack.DTO.ObraRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.ObraResponseDTO;
import br.ueg.trindade.danyella_web2_fullstack.model.Obra;
import br.ueg.trindade.danyella_web2_fullstack.service.ObraService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/obras")
@RequiredArgsConstructor
public class ObraController {

    private final ObraService obraService;

    // Lista todas as obras do usuário autenticado
    @GetMapping
    public List<ObraResponseDTO> listar(
            @AuthenticationPrincipal UserDetails usuario) {

        return obraService.listarPorUsername(usuario.getUsername())
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    // Busca uma obra específica
    @GetMapping("/{id}")
    public ObraResponseDTO buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails usuario) {

        Obra obra = obraService.buscarPorIdEUsername(
                id, usuario.getUsername());

        return converterParaResponse(obra);
    }

    // Cadastra uma nova obra
    @PostMapping
    public ResponseEntity<ObraResponseDTO> cadastrar(
            @RequestBody ObraRequestDTO dto,
            @AuthenticationPrincipal UserDetails usuario) {

        Obra obra = converterParaEntidade(dto);

        Obra obraSalva = obraService.cadastrarPorUsername(
                obra, usuario.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(converterParaResponse(obraSalva));
    }

    // Atualiza uma obra existente
    @PutMapping("/{id}")
    public ObraResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody ObraRequestDTO dto,
            @AuthenticationPrincipal UserDetails usuario) {

        Obra dados = converterParaEntidade(dto);

        Obra obraAtualizada = obraService.atualizarPorUsername(
                id, dados, usuario.getUsername());

        return converterParaResponse(obraAtualizada);
    }

    // Exclui uma obra
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails usuario) {

        obraService.excluirPorUsername(
                id, usuario.getUsername());

        return ResponseEntity.noContent().build();
    }

    // Converte DTO de requisição para entidade
    private Obra converterParaEntidade(ObraRequestDTO dto) {
        return Obra.builder()
                .titulo(dto.getTitulo())
                .criador(dto.getCriador())
                .descricao(dto.getDescricao())
                .genero(dto.getGenero())
                .anoLancamento(dto.getAnoLancamento())
                .capaUrl(dto.getCapaUrl())
                .tipo(dto.getTipo())
                .status(dto.getStatus())
                .dataInicio(dto.getDataInicio())
                .dataConclusao(dto.getDataConclusao())
                .quantidadeTotal(dto.getQuantidadeTotal())
                .progressoAtual(dto.getProgressoAtual())
                .unidadeTotal(dto.getUnidadeTotal())
                .build();
    }

    // Converte entidade para DTO de resposta
    private ObraResponseDTO converterParaResponse(Obra obra) {
        return ObraResponseDTO.builder()
                .id(obra.getId())
                .titulo(obra.getTitulo())
                .criador(obra.getCriador())
                .descricao(obra.getDescricao())
                .genero(obra.getGenero())
                .anoLancamento(obra.getAnoLancamento())
                .capaUrl(obra.getCapaUrl())
                .tipo(obra.getTipo())
                .status(obra.getStatus())
                .dataInicio(obra.getDataInicio())
                .dataConclusao(obra.getDataConclusao())
                .quantidadeTotal(obra.getQuantidadeTotal())
                .progressoAtual(obra.getProgressoAtual())
                .unidadeTotal(obra.getUnidadeTotal())
                .build();
    }
}

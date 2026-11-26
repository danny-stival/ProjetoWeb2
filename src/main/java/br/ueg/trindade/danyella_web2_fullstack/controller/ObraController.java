package br.ueg.trindade.danyella_web2_fullstack.controller;

import br.ueg.trindade.danyella_web2_fullstack.DTO.ObraRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.ObraResponseDTO;
import br.ueg.trindade.danyella_web2_fullstack.model.Obra;
import br.ueg.trindade.danyella_web2_fullstack.service.ObraService;
import br.ueg.trindade.danyella_web2_fullstack.security.UsuarioAutenticado;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/obras")
@RequiredArgsConstructor
public class ObraController {

    private final ObraService obraService;

    @GetMapping
    public List<ObraResponseDTO> listar(
            @AuthenticationPrincipal UsuarioAutenticado usuario) {

        return obraService.listarPorUsuario(usuario.getId())
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ObraResponseDTO buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioAutenticado usuario) {

        Obra obra = obraService.buscarPorId(
                id, usuario.getId());

        return converterParaResponse(obra);
    }

    @PostMapping
    public ResponseEntity<ObraResponseDTO> cadastrar(
            @RequestBody @Valid ObraRequestDTO dto,
            @AuthenticationPrincipal UsuarioAutenticado usuario) {

        Obra obra = converterParaEntidade(dto);

        Obra obraSalva = obraService.cadastrar(
                obra, usuario.getId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(converterParaResponse(obraSalva));
    }

    @PutMapping("/{id}")
    public ObraResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ObraRequestDTO dto,
            @AuthenticationPrincipal UsuarioAutenticado usuario) {

        Obra dados = converterParaEntidade(dto);

        Obra obraAtualizada = obraService.atualizar(
                id, dados, usuario.getId());

        return converterParaResponse(obraAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioAutenticado usuario) {

        obraService.excluir(id, usuario.getId());

        return ResponseEntity.noContent().build();
    }

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


package br.ueg.trindade.danyella_web2_fullstack.service;

import br.ueg.trindade.danyella_web2_fullstack.model.Obra;
import br.ueg.trindade.danyella_web2_fullstack.model.Usuario;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.StatusObra;
import br.ueg.trindade.danyella_web2_fullstack.repository.ObraRepository;
import br.ueg.trindade.danyella_web2_fullstack.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ObraService {

    private final ObraRepository obraRepository;
    private final UsuarioRepository usuarioRepository;

    private Long obterUsuarioId(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado."))
                .getId();
    }

    public ObraService(ObraRepository obraRepository,
                       UsuarioRepository usuarioRepository) {
        this.obraRepository = obraRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Lista as obras de um usuário
    public List<Obra> listarPorUsuario(Long usuarioId) {
        return obraRepository.findAllByUsuario_Id(usuarioId);
    }

    // Busca uma obra específica
    public Obra buscarPorId(Long id, Long usuarioId) {
        return obraRepository.findByIdAndUsuario_Id(id, usuarioId)
                .orElseThrow(() ->
                        new RuntimeException("Obra não encontrada."));
    }

    // Cadastra uma nova obra
    @Transactional
    public Obra cadastrar(Obra obra, Long usuarioId) {

        validarObra(obra);

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado."));

        obra.setUsuario(usuario);

        return obraRepository.save(obra);
    }

    // Atualiza uma obra existente
    @Transactional
    public Obra atualizar(Long id, Obra dados, Long usuarioId) {

        validarObra(dados);

        Obra obra = buscarPorId(id, usuarioId);

        obra.setTitulo(dados.getTitulo());
        obra.setCriador(dados.getCriador());
        obra.setDescricao(dados.getDescricao());
        obra.setGenero(dados.getGenero());
        obra.setAnoLancamento(dados.getAnoLancamento());
        obra.setCapaUrl(dados.getCapaUrl());
        obra.setTipo(dados.getTipo());
        obra.setStatus(dados.getStatus());
        obra.setDataInicio(dados.getDataInicio());
        obra.setDataConclusao(dados.getDataConclusao());
        obra.setQuantidadeTotal(dados.getQuantidadeTotal());
        obra.setProgressoAtual(dados.getProgressoAtual());
        obra.setUnidadeTotal(dados.getUnidadeTotal());

        return obraRepository.save(obra);
    }

    // Exclui uma obra
    @Transactional
    public void excluir(Long id, Long usuarioId) {

        Obra obra = buscarPorId(id, usuarioId);

        obraRepository.delete(obra);
    }

    // Lista as obras do usuário autenticado
    public List<Obra> listarPorUsername(String username) {
        Long usuarioId = obterUsuarioId(username);
        return listarPorUsuario(usuarioId);
    }

    // Busca uma obra pertencente ao usuário autenticado
    public Obra buscarPorIdEUsername(Long id, String username) {
        Long usuarioId = obterUsuarioId(username);
        return buscarPorId(id, usuarioId);
    }

    // Cadastra uma obra para o usuário autenticado
    public Obra cadastrarPorUsername(Obra obra, String username) {
        Long usuarioId = obterUsuarioId(username);
        return cadastrar(obra, usuarioId);
    }

    // Atualiza uma obra do usuário autenticado
    public Obra atualizarPorUsername(
            Long id, Obra dados, String username) {
        Long usuarioId = obterUsuarioId(username);
        return atualizar(id, dados, usuarioId);
    }

    // Exclui uma obra do usuário autenticado
    public void excluirPorUsername(Long id, String username) {
        Long usuarioId = obterUsuarioId(username);
        excluir(id, usuarioId);
    }

    // Valida os dados obrigatórios
    private void validarObra(Obra obra) {

        if (obra.getStatus() == StatusObra.CONCLUIDO) {
            obra.setProgressoAtual(obra.getQuantidadeTotal());
        }

        if (obra.getTitulo() == null ||
                obra.getTitulo().isBlank()) {
            throw new IllegalArgumentException(
                    "O título da obra é obrigatório.");
        }

        if (obra.getTipo() == null) {
            throw new IllegalArgumentException(
                    "O tipo da obra é obrigatório.");
        }

        if (obra.getStatus() == null) {
            throw new IllegalArgumentException(
                    "O status da obra é obrigatório.");
        }

        if (obra.getDataInicio() != null
                && obra.getDataConclusao() != null
                && obra.getDataConclusao().isBefore(obra.getDataInicio())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data de conclusão não pode ser anterior à data de início."
            );
        }

    }
}

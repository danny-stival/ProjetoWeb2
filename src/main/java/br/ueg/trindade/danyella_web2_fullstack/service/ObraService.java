package br.ueg.trindade.danyella_web2_fullstack.service;

import br.ueg.trindade.danyella_web2_fullstack.model.Obra;
import br.ueg.trindade.danyella_web2_fullstack.model.Usuario;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.StatusObra;
import br.ueg.trindade.danyella_web2_fullstack.repository.ObraRepository;
import br.ueg.trindade.danyella_web2_fullstack.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ObraService {

    private final ObraRepository obraRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Obra> listarPorUsuario(Long usuarioId) {

        return obraRepository.findAllByUsuario_Id(usuarioId);
    }

    public Obra buscarPorId(Long id, Long usuarioId) {

        return obraRepository.findByIdAndUsuario_Id(
                        id, usuarioId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Obra não encontrada."
                        ));
    }

    @Transactional
    public Obra cadastrar(Obra obra, Long usuarioId) {

        validarObra(obra);

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuário não encontrado."
                        ));

        obra.setUsuario(usuario);

        return obraRepository.save(obra);
    }

    @Transactional
    public Obra atualizar(Long id, Obra dados, Long usuarioId) {

        Obra obra = buscarPorId(id, usuarioId);

        validarObra(dados);

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

    @Transactional
    public void excluir(Long id, Long usuarioId) {

        Obra obra = buscarPorId(id, usuarioId);

        obraRepository.delete(obra);
    }

    private void validarObra(Obra obra) {

        if (obra.getTitulo() == null ||
                obra.getTitulo().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O título da obra é obrigatório."
            );
        }

        if (obra.getTipo() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O tipo da obra é obrigatório."
            );
        }

        if (obra.getStatus() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O status da obra é obrigatório."
            );
        }


        if (obra.getDataInicio() != null //data errada
                && obra.getDataConclusao() != null
                && obra.getDataConclusao()
                .isBefore(obra.getDataInicio())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data de conclusão não pode ser anterior à data de início."
            );
        }


        if (obra.getStatus() == StatusObra.CONCLUIDO) { //obra concluida

            obra.setProgressoAtual(
                    obra.getQuantidadeTotal()
            );
        }
    }
}

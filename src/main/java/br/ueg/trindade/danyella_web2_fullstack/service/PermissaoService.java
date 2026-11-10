package br.ueg.trindade.danyella_web2_fullstack.Service;

import br.ueg.trindade.danyella_web2_fullstack.Model.Permissao;
import br.ueg.trindade.danyella_web2_fullstack.Repository.PermissaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissaoService {

    private final PermissaoRepository permissaoRepository;

    public List<Permissao> listar() {
        return permissaoRepository.findAll();
    }

    public Permissao buscarPorId(Long id) {
        return permissaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permissão não encontrada"));
    }

    public Permissao criar(Permissao permissao) {
        if (permissaoRepository.findByNome(permissao.getNome()).isPresent()) {
            throw new RuntimeException("Já existe uma permissão com esse nome");
        }
        return permissaoRepository.save(permissao);
    }

    public Permissao atualizar(Long id, Permissao permissaoAtualizada) {
        Permissao permissao = permissaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permissão não encontrada"));

        if (permissaoRepository.existsByNomeAndIdNot(permissaoAtualizada.getNome(), id)) {
            throw new RuntimeException("Já existe outra permissão com esse nome");
        }

        permissao.setNome(permissaoAtualizada.getNome());
        permissao.setDescricao(permissaoAtualizada.getDescricao());

        return permissaoRepository.save(permissao);
    }

    public void deletar(Long id) {
        if (!permissaoRepository.existsById(id)) {
            throw new RuntimeException("Permissão não encontrada");
        }
        permissaoRepository.deleteById(id);
    }
}
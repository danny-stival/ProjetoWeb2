package br.ueg.trindade.danyella_web2_fullstack.service;

import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.model.Usuario;
import br.ueg.trindade.danyella_web2_fullstack.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final PasswordEncoder passwordEncoder; //seguranca

    private final UsuarioRepository usuarioRepository;

    public List<UsuarioDTO> listar() {
        return usuarioRepository.findAll()
                .stream()
                .map(Usuario::toDTO)
                .toList();
    }

    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return usuario.toDTO();
    }

    public UsuarioDTO criar(UsuarioRequestDTO dto) {

        if (usuarioRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Já existe um usuário com esse username");
        }

        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe um usuário com esse e-mail");
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .build();

        return usuarioRepository.save(usuario).toDTO();
    }

    public UsuarioDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Se o username mudou, valida se o novo já está em uso por outro usuário
        if (usuarioRepository.existsByUsernameAndIdNot(dto.getUsername(), id)) {
            throw new RuntimeException("Já existe outro usuário com esse username");
        }
        if (usuarioRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new RuntimeException("Já existe outro usuário com esse e-mail");
        }

        usuario.setNome(dto.getNome());
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());

        return usuarioRepository.save(usuario).toDTO();
    }

    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}
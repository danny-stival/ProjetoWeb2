
package br.ueg.trindade.danyella_web2_fullstack.service;

import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.model.Usuario;
import br.ueg.trindade.danyella_web2_fullstack.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final PasswordEncoder passwordEncoder;
    private final UsuarioRepository usuarioRepository;

    public List<UsuarioDTO> listar() {

        return usuarioRepository.findAll()
                .stream()
                .map(Usuario::toDTO)
                .toList();
    }

    public UsuarioDTO buscarPorId(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado."
                ));

        return usuario.toDTO();
    }

    public UsuarioDTO criar(UsuarioRequestDTO dto) {

        // RN - Nome de usuário único
        if (usuarioRepository.findByUsername(dto.getUsername()).isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este nome de usuário já está em uso."
            );
        }

        // RN - E-mail único
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma conta cadastrada com este e-mail."
            );
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
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado."
                ));

        // Verifica se o username pertence a outro usuário
        if (usuarioRepository.existsByUsernameAndIdNot(
                dto.getUsername(), id)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este nome de usuário já está em uso."
            );
        }

        // Verifica se o e-mail pertence a outro usuário
        if (usuarioRepository.existsByEmailAndIdNot(
                dto.getEmail(), id)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma conta cadastrada com este e-mail."
            );
        }

        usuario.setNome(dto.getNome());
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());

        return usuarioRepository.save(usuario).toDTO();
    }

    public void deletar(Long id) {

        if (!usuarioRepository.existsById(id)) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuário não encontrado."
            );
        }

        usuarioRepository.deleteById(id);
    }
}

package br.ueg.trindade.danyella_web2_fullstack.service;

import br.ueg.trindade.danyella_web2_fullstack.DTO.AlterarSenhaDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.AlterarUsernameDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.ExcluirContaDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.PerfilRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioRequestDTO;

import br.ueg.trindade.danyella_web2_fullstack.model.Usuario;

import br.ueg.trindade.danyella_web2_fullstack.repository.UsuarioRepository;
import br.ueg.trindade.danyella_web2_fullstack.repository.ObraRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final PasswordEncoder passwordEncoder;
    private final UsuarioRepository usuarioRepository;
    private final ObraRepository obraRepository;

    private Usuario obterUsuarioPorId(Long id) {

        return usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuário não encontrado."
                        ));
    }

    public List<UsuarioDTO> listar() {

        return usuarioRepository.findAll()
                .stream()
                .map(Usuario::toDTO)
                .toList();
    }

    public UsuarioDTO buscarPorId(Long id) {

        return obterUsuarioPorId(id).toDTO();
    }

    @Transactional
    public UsuarioDTO criar(UsuarioRequestDTO dto) {

        if (usuarioRepository.findByUsername(
                dto.getUsername()).isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este nome de usuário já está em uso."
            );
        }

        if (usuarioRepository.findByEmail(
                dto.getEmail()).isPresent()) {

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

    public UsuarioDTO consultarPerfil(Long usuarioId) {

        return obterUsuarioPorId(usuarioId).toDTO();
    }

    @Transactional
    public UsuarioDTO atualizarPerfil(
            Long usuarioId,
            PerfilRequestDTO dto
    ) {

        Usuario usuario = obterUsuarioPorId(usuarioId);

        String novoNome = dto.getNome().trim();
        String novoEmail = dto.getEmail().trim();

        validarEmail(novoEmail, usuarioId);

        usuario.setNome(novoNome);
        usuario.setEmail(novoEmail);

        return usuarioRepository.save(usuario).toDTO();
    }

    @Transactional
    public void alterarUsername(
            Long usuarioId,
            AlterarUsernameDTO dto
    ) {

        Usuario usuario = obterUsuarioPorId(usuarioId);

        validarSenhaAtual(usuario, dto.getSenhaAtual());

        String novoUsername = dto.getNovoUsername().trim();

        if (novoUsername.equals(usuario.getUsername())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O novo nome de usuário deve ser diferente do atual."
            );
        }

        validarUsername(novoUsername, usuarioId);

        usuario.setUsername(novoUsername);

        invalidarTokens(usuario);

        usuarioRepository.save(usuario);
    }

    @Transactional
    public void alterarSenha(
            Long usuarioId,
            AlterarSenhaDTO dto
    ) {

        Usuario usuario = obterUsuarioPorId(usuarioId);

        validarSenhaAtual(usuario, dto.getSenhaAtual());

        if (!dto.getNovaSenha().equals(dto.getConfirmarSenha())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A confirmação da senha não corresponde à nova senha."
            );
        }

        if (dto.getNovaSenha()
                .getBytes(StandardCharsets.UTF_8).length > 72) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A nova senha excede o limite de 72 bytes."
            );
        }

        if (passwordEncoder.matches(
                dto.getNovaSenha(), usuario.getSenha())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A nova senha deve ser diferente da senha atual."
            );
        }

        usuario.setSenha(
                passwordEncoder.encode(dto.getNovaSenha())
        );

        invalidarTokens(usuario);

        usuarioRepository.save(usuario);
    }

    @Transactional
    public void excluirConta(
            Long usuarioId,
            ExcluirContaDTO dto
    ) {

        Usuario usuario = obterUsuarioPorId(usuarioId);

        validarSenhaAtual(usuario, dto.getSenhaAtual());

        if (!"EXCLUIR".equals(dto.getConfirmacao())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Digite EXCLUIR para confirmar a exclusão da conta."
            );
        }

        obraRepository.excluirTodasPorUsuario(usuarioId);

        usuarioRepository.delete(usuario);
    }

    private void validarUsername(
            String username,
            Long usuarioId
    ) {

        if (usuarioRepository.existsByUsernameAndIdNot(
                username, usuarioId)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este nome de usuário já está em uso."
            );
        }
    }

    private void validarEmail(
            String email,
            Long usuarioId
    ) {

        if (usuarioRepository.existsByEmailAndIdNot(
                email, usuarioId)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma conta cadastrada com este e-mail."
            );
        }
    }

    private void validarSenhaAtual(
            Usuario usuario,
            String senhaAtual
    ) {

        if (senhaAtual.getBytes(StandardCharsets.UTF_8).length > 72
                || !passwordEncoder.matches(
                senhaAtual, usuario.getSenha())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A senha atual está incorreta."
            );
        }
    }

    private void invalidarTokens(Usuario usuario) {

        usuario.setVersaoToken(
                usuario.getVersaoToken() + 1
        );
    }
}

package br.ueg.trindade.danyella_web2_fullstack.security;

import br.ueg.trindade.danyella_web2_fullstack.model.Usuario;
import br.ueg.trindade.danyella_web2_fullstack.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    // Utilizado durante o login
    @Override
    public UsuarioAutenticado loadUserByUsername(
            String username
    ) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuário não encontrado."
                        )
                );

        return new UsuarioAutenticado(usuario);
    }

    // Utilizado durante a validação do JWT
    public UsuarioAutenticado loadUserById(Long id) {

        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuário não encontrado."
                        )
                );

        return new UsuarioAutenticado(usuario);
    }
}

package br.ueg.trindade.danyella_web2_fullstack.security;

import br.ueg.trindade.danyella_web2_fullstack.model.Usuario;

import lombok.Getter;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.CredentialsContainer;

import java.util.Collection;
import java.util.List;

@Getter
public class UsuarioAutenticado
        implements UserDetails, CredentialsContainer {

    private final Long id;
    private final String username;
    private String password;
    private final Integer versaoToken;

    public UsuarioAutenticado(Usuario usuario) {

        this.id = usuario.getId();
        this.username = usuario.getUsername();
        this.password = usuario.getSenha();
        this.versaoToken = usuario.getVersaoToken();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return List.of(
                new SimpleGrantedAuthority("USER")
        );
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public void eraseCredentials() {
        this.password = null;
    }
}

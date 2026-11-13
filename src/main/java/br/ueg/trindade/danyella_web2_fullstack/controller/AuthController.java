package br.ueg.trindade.danyella_web2_fullstack.controller;

import br.ueg.trindade.danyella_web2_fullstack.DTO.LoginRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.TokenResponseDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioDTO;
import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioRequestDTO;
import br.ueg.trindade.danyella_web2_fullstack.security.JwtService;
import br.ueg.trindade.danyella_web2_fullstack.service.UsuarioService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioDTO cadastrar(@RequestBody UsuarioRequestDTO dto) {
        return usuarioService.criar(dto);
    }

    @PostMapping("/login")
    public TokenResponseDTO login(@RequestBody LoginRequestDTO dto) {

        try {
            var authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.getUsername(),
                            dto.getSenha()
                    )
            );

            String username = authentication.getName();

            String token = jwtService.gerarToken(username);

            return new TokenResponseDTO(
                    token,
                    "Bearer",
                    username
            );

        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Username ou senha inválidos"
            );
        }
    }
}
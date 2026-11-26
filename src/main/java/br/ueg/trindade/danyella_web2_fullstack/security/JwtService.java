package br.ueg.trindade.danyella_web2_fullstack.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    @Value("${api.security.token.secret}")
    private String secret;

    private SecretKey getSigningKey() {

        byte[] keyBytes = Base64.getDecoder()
                .decode(secret);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String gerarToken(
            UsuarioAutenticado usuario
    ) {

        Date agora = new Date();

        Date expiracao = new Date(
                agora.getTime() + 1000L * 60 * 60 * 2
        );

        return Jwts.builder()
                .subject(usuario.getId().toString())
                .claim("versao", usuario.getVersaoToken())
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims validarToken(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

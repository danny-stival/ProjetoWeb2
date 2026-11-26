package br.ueg.trindade.danyella_web2_fullstack.model;

import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Usuario {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String nome;
        private String username;
        private String email;

        @JsonIgnore
        @ToString.Exclude
        private String senha;

        @JsonIgnore
        @Builder.Default
        @Column(name = "versao_token", nullable = false)
        private Integer versaoToken = 0;

        @JsonIgnore
        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        @Column(name = "foto_perfil", columnDefinition = "bytea")
        private byte[] fotoPerfil;

        @JsonIgnore
        @Column(name = "foto_content_type", length = 50)
        private String fotoContentType;

        public UsuarioDTO toDTO() {
                return new UsuarioDTO(id, nome, username, email);
        }
}

package br.ueg.trindade.danyella_web2_fullstack.Model;

import br.ueg.trindade.danyella_web2_fullstack.DTO.UsuarioDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
        private String senha;

        public UsuarioDTO toDTO() {
                return new UsuarioDTO(id, nome, username, email);
        }
}
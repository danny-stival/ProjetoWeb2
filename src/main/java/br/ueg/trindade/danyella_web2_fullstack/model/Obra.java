
package br.ueg.trindade.danyella_web2_fullstack.model;

import br.ueg.trindade.danyella_web2_fullstack.model.Usuario;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.StatusObra;
import br.ueg.trindade.danyella_web2_fullstack.model.enums.TipoObra;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "obras")
public class Obra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    private String criador;

    @Column(length = 1000)
    private String descricao;

    private String genero;

    private Integer anoLancamento;

    private String capaUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoObra tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusObra status;

    private LocalDate dataInicio;

    private LocalDate dataConclusao;

    private Integer quantidadeTotal;

    private Integer progressoAtual;

    private String unidadeTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

}


package br.ueg.trindade.danyella_web2_fullstack.exception;

import br.ueg.trindade.danyella_web2_fullstack.DTO.ErroResponseDTO;

import lombok.extern.slf4j.Slf4j;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Exceções das regras de negócio
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroResponseDTO> tratarRegraNegocio(
            ResponseStatusException ex) {

        return criarResposta(
                ex.getStatusCode().value(),
                ex.getReason()
        );
    }

    // Erros de validação dos DTOs
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponseDTO> tratarValidacao(
            MethodArgumentNotValidException ex) {

        String mensagem = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(erro -> erro.getDefaultMessage())
                .findFirst()
                .orElse("Dados inválidos.");

        return criarResposta(
                HttpStatus.BAD_REQUEST.value(),
                mensagem
        );
    }

    // Violações de integridade do banco de dados
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponseDTO> tratarIntegridade(
            DataIntegrityViolationException ex) {

        return criarResposta(
                HttpStatus.CONFLICT.value(),
                "Os dados informados conflitam com os registros existentes."
        );
    }

    // Método auxiliar para padronizar as respostas
    private ResponseEntity<ErroResponseDTO> criarResposta(
            int status,
            String mensagem) {

        ErroResponseDTO erro = new ErroResponseDTO(
                status,
                mensagem,
                LocalDateTime.now()
        );

        return ResponseEntity.status(status).body(erro);
    }
}

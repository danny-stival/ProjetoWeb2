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
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroResponseDTO> tratarResponseStatus(
            ResponseStatusException ex
    ) {

        return ResponseEntity
                .status(ex.getStatusCode())
                .body(new ErroResponseDTO(
                        ex.getStatusCode().value(),
                        ex.getReason(),
                        LocalDateTime.now()
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponseDTO> tratarValidacao(
            MethodArgumentNotValidException ex
    ) {

        String mensagem = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(erro -> erro.getDefaultMessage())
                .orElse("Dados inválidos.");

        return criarResposta(
                HttpStatus.BAD_REQUEST,
                mensagem
        );
    }
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponseDTO> tratarIntegridade(
            DataIntegrityViolationException ex
    ) {

        log.warn("Violação de integridade no banco de dados.");

        return criarResposta(
                HttpStatus.CONFLICT,
                "A operação não pôde ser concluída devido a um conflito de dados."
        );
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErroResponseDTO> tratarTamanhoArquivo(
            MaxUploadSizeExceededException ex
    ) {

        return criarResposta(
                HttpStatus.PAYLOAD_TOO_LARGE,
                "A imagem deve possuir no máximo 2 MB."
        );
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ErroResponseDTO> tratarArquivoAusente(
            MissingServletRequestPartException ex
    ) {

        return criarResposta(
                HttpStatus.BAD_REQUEST,
                "O arquivo obrigatório não foi enviado."
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponseDTO> tratarJsonInvalido(
            HttpMessageNotReadableException ex
    ) {

        return criarResposta(
                HttpStatus.BAD_REQUEST,
                "O corpo da requisição está ausente ou possui dados inválidos."
        );
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErroResponseDTO> tratarFormatoInvalido(
            HttpMediaTypeNotSupportedException ex
    ) {

        return criarResposta(
                HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "O formato da requisição não é suportado."
        );
    }

    private ResponseEntity<ErroResponseDTO> criarResposta(
            HttpStatus status,
            String mensagem
    ) {

        ErroResponseDTO erro = new ErroResponseDTO(
                status.value(),
                mensagem,
                LocalDateTime.now()
        );

        return ResponseEntity.status(status).body(erro);
    }
}

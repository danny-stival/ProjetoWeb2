package br.ueg.trindade.danyella_web2_fullstack.service;

import br.ueg.trindade.danyella_web2_fullstack.DTO.FotoPerfilDTO;
import br.ueg.trindade.danyella_web2_fullstack.model.Usuario;
import br.ueg.trindade.danyella_web2_fullstack.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Iterator;

@Service
@RequiredArgsConstructor
public class FotoPerfilService {

    private final UsuarioRepository usuarioRepository;

    private static final long TAMANHO_MAXIMO = 2 * 1024 * 1024;

    private static final int DIMENSAO_MAXIMA = 4096;

    private Usuario obterUsuario(Long usuarioId) {

        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuário não encontrado."
                        ));
    }

    @Transactional(readOnly = true)
    public FotoPerfilDTO consultarFoto(Long usuarioId) {

        Usuario usuario = obterUsuario(usuarioId);

        if (usuario.getFotoPerfil() == null) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "O usuário não possui foto de perfil."
            );
        }

        return new FotoPerfilDTO(
                usuario.getFotoPerfil(),
                usuario.getFotoContentType()
        );
    }
    @Transactional
    public void atualizarFoto(
            Long usuarioId,
            MultipartFile arquivo
    ) {

        Usuario usuario = obterUsuario(usuarioId);

        validarArquivo(arquivo);

        try {

            byte[] imagem = arquivo.getBytes();

            String contentType = validarImagem(imagem);

            usuario.setFotoPerfil(imagem);
            usuario.setFotoContentType(contentType);

            usuarioRepository.save(usuario);

        } catch (IOException e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não foi possível ler a imagem."
            );
        }
    }
    @Transactional
    public void removerFoto(Long usuarioId) {

        Usuario usuario = obterUsuario(usuarioId);

        usuario.setFotoPerfil(null);
        usuario.setFotoContentType(null);

        usuarioRepository.save(usuario);
    }

    private void validarArquivo(MultipartFile arquivo) {

        if (arquivo == null || arquivo.isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selecione uma imagem."
            );
        }

        if (arquivo.getSize() > TAMANHO_MAXIMO) {

            throw new ResponseStatusException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "A imagem deve possuir no máximo 2 MB."
            );
        }
    }

    private String validarImagem(byte[] imagem)
            throws IOException {

        try (ImageInputStream entrada =
                     ImageIO.createImageInputStream(
                             new ByteArrayInputStream(imagem))) {

            if (entrada == null) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Imagem inválida."
                );
            }

            Iterator<ImageReader> leitores =
                    ImageIO.getImageReaders(entrada);

            if (!leitores.hasNext()) {

                throw new ResponseStatusException(
                        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                        "Formato inválido. Utilize JPEG ou PNG."
                );
            }

            ImageReader leitor = leitores.next();

            try {

                leitor.setInput(entrada);

                String formato = leitor.getFormatName();

                String contentType;

                if ("JPEG".equalsIgnoreCase(formato)
                        || "JPG".equalsIgnoreCase(formato)) {

                    contentType = "image/jpeg";

                } else if ("PNG".equalsIgnoreCase(formato)) {

                    contentType = "image/png";

                } else {

                    throw new ResponseStatusException(
                            HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                            "Utilize uma imagem JPEG ou PNG."
                    );
                }

                int largura = leitor.getWidth(0);
                int altura = leitor.getHeight(0);

                if (largura > DIMENSAO_MAXIMA
                        || altura > DIMENSAO_MAXIMA
                        || largura <= 0
                        || altura <= 0) {

                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "A imagem deve possuir dimensões de até 4096 x 4096 pixels."
                    );
                }

                // Verifica se a imagem pode ser decodificada
                if (leitor.read(0) == null) {

                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "A imagem está inválida ou corrompida."
                    );
                }

                return contentType;

            } finally {

                leitor.dispose();
            }
        }
    }
}

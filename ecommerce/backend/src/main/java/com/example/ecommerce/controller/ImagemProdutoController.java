package com.example.ecommerce.controller;
import com.example.ecommerce.services.ImagemProdutoService;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/imagens")

public class ImagemProdutoController {
    @Autowired
    private ImagemProdutoService imagemProdutoService;

   @GetMapping("/{produtoId}/{nomeArquivo}")
     public ResponseEntity<byte[]> obterImagem(
        @PathVariable String produtoId,
        @PathVariable String nomeArquivo) {

    try {
        nomeArquivo = URLDecoder.decode(nomeArquivo, StandardCharsets.UTF_8);

        System.out.println(">>> Buscando imagem: produtoId = " + produtoId + ", nomeArquivo = " + nomeArquivo);

        byte[] imagem = imagemProdutoService.carregarImagem(produtoId, nomeArquivo);

        String extensao = nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1).toLowerCase();

        MediaType mediaType = switch (extensao) {
            case "png" -> MediaType.IMAGE_PNG;
            case "jpeg" -> MediaType.IMAGE_JPEG;
            case "jpg" -> MediaType.IMAGE_JPEG;
            case "gif" -> MediaType.IMAGE_GIF;
            default -> MediaType.IMAGE_JPEG;
        };

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);

        return new ResponseEntity<>(imagem, headers, HttpStatus.OK);

    } catch (Exception e) {
        System.err.println("Erro ao buscar imagem: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
}

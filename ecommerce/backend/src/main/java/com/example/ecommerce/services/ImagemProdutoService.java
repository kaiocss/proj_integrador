package com.example.ecommerce.services;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImagemProdutoService {

    @Value("${imagens.produto}")
    private String basePath; 

    public byte[] carregarImagem(String produtoId, String nomeArquivo) throws IOException {
    Path caminhoImagem = Paths.get(basePath, produtoId, nomeArquivo).normalize();
    
    System.out.println("CAMINHO BUSCADO: " + caminhoImagem.toAbsolutePath());

    if (!Files.exists(caminhoImagem)) {
        throw new FileNotFoundException("Imagem não encontrada: " + caminhoImagem.toAbsolutePath());
    }

    return Files.readAllBytes(caminhoImagem);
}
}


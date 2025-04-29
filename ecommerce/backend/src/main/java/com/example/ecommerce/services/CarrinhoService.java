package com.example.ecommerce.services;
import com.example.ecommerce.model.Carrinho;
import com.example.ecommerce.model.Produto;
import com.example.ecommerce.model.Usuario;
import com.example.ecommerce.repository.CarrinhoRepository;
import com.example.ecommerce.repository.ProdutoRepository;
import com.example.ecommerce.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CarrinhoService {

    @Autowired
    private CarrinhoRepository carrinhoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository; 

    public Carrinho adicionarProdutoAoCarrinho(Carrinho carrinho) {
        Produto produto = produtoRepository.findById(carrinho.getProduto().getCodigo())
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));

        Carrinho existente = carrinhoRepository.findByProduto(produto);

        if (existente != null) {
            existente.setQuantidade(existente.getQuantidade() + carrinho.getQuantidade());
            return carrinhoRepository.save(existente);
        } else {
            carrinho.setProduto(produto);
            carrinho.setPrecoUnitario(produto.getValorProduto()); // <- ESSENCIAL
            return carrinhoRepository.save(carrinho);
        }
    }

    public List<Carrinho> listarCarrinho() {
        return carrinhoRepository.findAll();
    }

    public Carrinho atualizarQuantidade(int id, int novaQuantidade) {
        Optional<Carrinho> carrinhoOptional = carrinhoRepository.findById(id);
        if (carrinhoOptional.isPresent()) {
            Carrinho carrinho = carrinhoOptional.get();
            carrinho.setQuantidade(novaQuantidade);
            return carrinhoRepository.save(carrinho);
        }
        return null;
    }

    public void removerItem(int id) {
        carrinhoRepository.deleteById(id);
    }

    public void limparCarrinho() {
        carrinhoRepository.deleteAll();
    }

    public Carrinho buscarPorProduto(Produto produto) {
        return carrinhoRepository.findByProduto(produto);
    }

    public void associarCarrinhoAoUsuario(Long usuarioId) {
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        
        Carrinho carrinho = carrinhoRepository.findByUsuario(usuario);
            if (carrinho == null) {
            carrinho = new Carrinho();
            carrinho.setUsuario(usuario); 
            carrinhoRepository.save(carrinho);
        }
    }
}

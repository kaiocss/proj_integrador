package com.example.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.ecommerce.model.Carrinho;
import com.example.ecommerce.model.Produto;
import com.example.ecommerce.model.Usuario;

@Repository
public interface CarrinhoRepository extends JpaRepository<Carrinho, Integer> {
    Carrinho findByProduto(Produto produto);
    Carrinho findByUsuario(Usuario usuario);
}



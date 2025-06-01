package com.example.ecommerce.repository;

import com.example.ecommerce.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    Optional<Produto> findByNome(String nome);

    @Query("SELECT p FROM Produto p LEFT JOIN FETCH p.imagens WHERE p.codigo = :codigo")
    Optional<Produto> buscarProdutoComImagens(@Param("codigo") Integer codigo);
}
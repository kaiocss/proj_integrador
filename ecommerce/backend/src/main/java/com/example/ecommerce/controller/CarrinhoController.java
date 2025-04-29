package com.example.ecommerce.controller;

import com.example.ecommerce.model.Carrinho;
import com.example.ecommerce.model.Produto;
import com.example.ecommerce.model.Status;
import com.example.ecommerce.model.Usuario;
import com.example.ecommerce.services.CarrinhoService;

import jakarta.servlet.http.HttpSessionEvent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/carrinho")
public class CarrinhoController {

    @Autowired
    private CarrinhoService carrinhoService;

    @PostMapping("/adicionar")
    public ResponseEntity<Carrinho> adicionarProduto(@RequestBody Carrinho carrinho) {
        Carrinho adicionado = carrinhoService.adicionarProdutoAoCarrinho(carrinho);
        return ResponseEntity.ok(adicionado);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Carrinho>> listarCarrinho() {
        return ResponseEntity.ok(carrinhoService.listarCarrinho());
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Carrinho> atualizarQuantidade(@PathVariable int id, @RequestBody int novaQuantidade) {
        Carrinho atualizado = carrinhoService.atualizarQuantidade(id, novaQuantidade);
        if (atualizado != null) {
            return ResponseEntity.ok(atualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerItem(@PathVariable int id) {
        carrinhoService.removerItem(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/limpar")
    public ResponseEntity<Void> limparCarrinho() {
        carrinhoService.limparCarrinho();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/associar")
    public ResponseEntity<?> associarCarrinhoAoUsuario(HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não logado.");
        }

        try {
            carrinhoService.associarCarrinhoAoUsuario(usuarioLogado.getId());
            return ResponseEntity.ok("Carrinho associado ao usuário com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao associar carrinho.");
        }
    }
}

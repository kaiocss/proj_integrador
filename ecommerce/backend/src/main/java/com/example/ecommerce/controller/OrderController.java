package com.example.ecommerce.controller;

import com.example.ecommerce.model.OrderSummaryDTO;
import com.example.ecommerce.model.Pedido;
import com.example.ecommerce.model.Usuario;
import com.example.ecommerce.services.OrderService;

import jakarta.servlet.http.HttpSession;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/summary")
    public OrderSummaryDTO getOrderSummary(@RequestParam Long orderId) {
        return orderService.getOrderSummary(orderId);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPedidoDetalhado(@PathVariable Long id, HttpSession session) {
    Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
      if (usuarioLogado == null) {
        return ResponseEntity.status(401).body("Usuário não autenticado.");
      }

     Pedido pedido = orderService.buscarPedidoPorId(id);
      if (pedido == null || !pedido.getUsuario().getId().equals(usuarioLogado.getId())) {
        return ResponseEntity.status(403).body("Acesso negado ao pedido.");
     }

    return ResponseEntity.ok(pedido);
}
    
    @PostMapping("/finalize")
    public ResponseEntity<?> finalizeOrder(@RequestBody Pedido pedido, HttpSession session) {
        try {
            Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
            if (usuarioLogado == null) {
                return ResponseEntity.status(401).body("Usuário não autenticado.");
            }

             if (pedido.getFormaPagamento() == null || pedido.getFormaPagamento().isBlank()) {
                return ResponseEntity.badRequest().body("A forma de pagamento é obrigatória.");
            }

            pedido.setUsuario(usuarioLogado);

            System.out.println("Dados recebidos para finalização: " + pedido);

            Pedido savedOrder = orderService.finalizeOrder(pedido);
            return ResponseEntity.ok(savedOrder);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro de validação: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Erro ao processar pedido: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao criar o pedido: " + e.getMessage());
        }
    }

    @GetMapping("/user")
     public ResponseEntity<?> listarPedidosUsuario(HttpSession session) {
      Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
       if (usuarioLogado == null) {
        return ResponseEntity.status(401).body("Usuário não autenticado.");
    }

    List<Pedido> pedidos = orderService.listarPedidosDoUsuario(usuarioLogado);
    return ResponseEntity.ok(pedidos);
}
}

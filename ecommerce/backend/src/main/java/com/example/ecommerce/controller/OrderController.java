package com.example.ecommerce.controller;

import com.example.ecommerce.model.OrderSummaryDTO;
import com.example.ecommerce.model.Pedido;
import com.example.ecommerce.services.OrderService;
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

    @PostMapping("/finalize")
    public ResponseEntity<?> finalizeOrder(@RequestBody Pedido pedido) {
        try {
            Pedido savedOrder = orderService.finalizeOrder(pedido);
            return ResponseEntity.ok(savedOrder); // Retorna o pedido salvo, incluindo o ID
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao criar o pedido: " + e.getMessage());
        }
    }
}

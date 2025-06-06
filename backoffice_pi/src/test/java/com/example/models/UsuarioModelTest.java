package com.example.models;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

public class UsuarioModelTest {

    @Test
    public void testToStringContainsFields() {
        Usuario usuario = new Usuario("email@teste.com", "adm", "ativado", "Joao", "123", "senha");
        String texto = usuario.toString();
        assertTrue(texto.contains("email@teste.com"));
        assertTrue(texto.contains("Joao"));
    }
}

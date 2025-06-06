package com.example.classes;

import static org.junit.jupiter.api.Assertions.*;

import com.example.models.Usuario;
import org.junit.jupiter.api.Test;

public class SessionManagerTest {

    @Test
    public void testSetAndGetUsuarioLogado() {
        Usuario usuario = new Usuario("email@test.com", "adm", "ativado", "Fulano", "12345678900", "senha");
        SessionManager.setUsuarioLogado(usuario);
        Usuario resultado = SessionManager.getUsuarioLogado();
        assertNotNull(resultado);
        assertEquals("email@test.com", resultado.getEmail());
    }
}

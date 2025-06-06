package com.example.cucumber;

import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

import com.example.classes.Menu;
import com.example.models.Usuario;

import io.cucumber.java.pt.*;

public class MenuSteps {

    private String senha;
    private String hash1;
    private String hash2;

    private String cpf;
    private boolean resultadoCpf;

    private Usuario usuario;

    @Dado("uma senha {string}")
    public void umaSenha(String senha) {
        this.senha = senha;
    }

    @Quando("eu criptografo a senha duas vezes")
    public void euCriptografoASenhaDuasVezes() throws Exception {
        hash1 = Menu.criptografarSenha(senha);
        hash2 = Menu.criptografarSenha(senha);
    }

    @Entao("o hash gerado deve ser igual para ambas as execucoes")
    public void oHashGeradoDeveSerIgualParaAmbasAsExecucoes() {
        assertEquals(hash1, hash2);
    }

    @Entao("o hash deve ser diferente da senha original")
    public void oHashDeveSerDiferenteDaSenhaOriginal() {
        assertNotEquals(senha, hash1);
    }

    @Dado("um CPF {string}")
    public void umCPF(String cpf) {
        this.cpf = cpf;
    }

    @Quando("eu valido o CPF")
    public void euValidoOCPF() {
        resultadoCpf = Menu.validaCPF(cpf);
    }

    @Entao("o resultado deve ser {word}")
    public void oResultadoDeveSer(String esperado) {
        boolean esperadoBool = Boolean.parseBoolean(esperado);
        assertEquals(esperadoBool, resultadoCpf);
    }

    @Dado("um usuario com status {string}")
    public void umUsuarioComStatus(String status) {
        usuario = new Usuario("teste@exemplo.com", "adm", status, "Teste", "12345678901", "senha");
    }

    @Quando("eu confirmo a alteracao de status")
    public void euConfirmoAlteracaoDeStatus() {
        String input = "Y\n";
        System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
    }

    @Quando("eu habilito ou desabilito o usuario")
    public void euHabilitoOuDesabilitoOUsuario() {
        Menu.habilitarDesabilitar(usuario);
    }

    @Entao("o status do usuario deve ser {string}")
    public void oStatusDoUsuarioDeveSer(String esperado) {
        assertEquals(esperado, usuario.getStatus());
    }
}

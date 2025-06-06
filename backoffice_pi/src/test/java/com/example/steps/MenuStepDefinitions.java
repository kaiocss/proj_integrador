package com.example.steps;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.example.classes.Menu;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class MenuStepDefinitions {

    private boolean resultado;

    @When("valido o CPF {string}")
    public void valido_o_cpf(String cpf) {
        resultado = Menu.validaCPF(cpf);
    }

    @Then("o resultado deve ser {string}")
    public void o_resultado_deve_ser(String esperado) {
        boolean esperadoBool = Boolean.parseBoolean(esperado);
        assertEquals(esperadoBool, resultado);
    }
}

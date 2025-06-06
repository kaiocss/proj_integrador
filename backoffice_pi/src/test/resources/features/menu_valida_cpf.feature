Feature: Validacao de CPF

  Scenario: CPF valido
    When valido o CPF "52998224725"
    Then o resultado deve ser "true"

  Scenario: CPF invalido
    When valido o CPF "12345678900"
    Then o resultado deve ser "false"

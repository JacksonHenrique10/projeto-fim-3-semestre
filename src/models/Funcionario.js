class Funcionario {
    constructor({ data_admissao, crm }) {
        this.data_admissao = data_admissao;
        this.crm = crm;
    }

    get DataAdmissao() { return this.data_admissao }
    set DataAdmissao(value) { this.data_admissao = value }

    get Crm() { return this.crm }
    set Crm(value) { this.crm = value }

    validaFuncionario() {
        return (
            this.data_admissao &&
            this.crm
        );
    }
}

module.exports = Funcionario;


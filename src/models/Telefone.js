class Telefone {
    constructor({ numero }) {
        this.numero = numero;
    }
    get Numero() { return this.numero }
    set Numero(value) { this.numero = value }

    validaTelefone() {
        return(
            this.numero
        );
    }
}

module.exports = Telefone;
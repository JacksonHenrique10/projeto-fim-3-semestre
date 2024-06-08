class Endereco {
    constructor({ logradouro, bairro, estado, numero, complemento, cep }) {
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.estado = estado;
        this.numero = numero;
        this.complemento = complemento;
        this.cep = cep;
    }

    get Logradouro() { return this.logradouro }
    set Logradouro(value) { this.logradouro = value }

    get Bairro() { return this.bairro }
    set Bairro(value) { this.bairro = value }

    get Estado() { return this.estado }
    set Estado(value) { this.estado = value }

    get Numero() { return this.numero }
    set Numero(value) { this.numero = value }

    get Complemento() { return this.complemento }
    set Complemento(value) { this.complemento = value }

    get Cep() { return this.cep }
    set Cep(value) { this.cep = value }

    validaEndereco() {
        return (
            this.logradouro &&
            this.bairro &&
            this.estado &&
            this.numero &&
            this.cep
        );
    }
}

module.exports = Endereco;


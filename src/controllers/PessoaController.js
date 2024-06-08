const Pessoa = require('../models/Pessoa');
const Endereco = require('../models/Endereco');
const Telefone = require('../models/Telefone');
const Funcionario = require('../models/Funcionario');
const { insertFuncionario, insertPaciente, insertLoginProfile, selectPessoaId,updatePessoa,deletePessoa  } = require('../models/PessoaModel');


const PessoaController = {
    adicionarPessoa: async (req, res) => {
        try {
            const { cpf, nome, data_nasc, genero, email, endereco, telefone, funcionario } = req.body;

            if (!endereco || endereco.length === 0) {
                console.log("Endereço não fornecido");
                return res.json({ message: "Endereço não fornecido" });
            }

            const objEndereco = new Endereco(endereco[0]);
            if (!objEndereco.validaEndereco()) {
                console.log("Verifique se todos os campos foram preenchidos no endereço");
                return res.json({ message: "O arquivo informado possui informações faltantes no endereço" });
            }

            const objPessoa = new Pessoa({ cpf, nome, data_nasc, genero, email });
            if (!objPessoa.validarCampos()) {
                console.log("Verifique se todos os campos foram preenchidos na pessoa");
                return res.json({ message: "O arquivo informado possui informações faltantes na pessoa" });
            }
            if (!objPessoa.validaCpf()) {
                console.log("CPF inválido");
                return res.json({ message: "CPF inválido" });
            }

            const objTelefones = telefone.map(tel => new Telefone(tel));

            let result;
            if (funcionario && funcionario.length > 0 && (funcionario[0].data_admissao || funcionario[0].crm)) {
                const objFuncionario = new Funcionario(funcionario[0]);
                if (!objFuncionario.validaFuncionario()) {
                    console.log("Verifique se todos os campos foram preenchidos no funcionário");
                    return res.json({ message: "O arquivo informado possui informações faltantes no funcionário" });
                }
                result = await insertFuncionario(objPessoa, objEndereco, objTelefones, objFuncionario);
            } else {
                result = await insertPaciente(objPessoa, objEndereco, objTelefones, {});
            }

            return res.json(result);
        } catch (error) {
            console.error(error);
            res.json({ error: error.message });
        }
    },

    buscarPessoa: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await selectPessoaId(id);

            if (result.length === 0) {
                return res.json({ message: "Pessoa não encontrada" });
            }

            return res.json(result[0]);
        } catch (error) {
            console.error(error);
            res.json({ error: error.message });
        }
    },

    atualizarPessoa: async (req, res) => {
        try {
            const { id } = req.params;
            const { cpf, nome, data_nasc, genero, email } = req.body;

            const objPessoa = new Pessoa({ cpf, nome, data_nasc, genero, email });
            if (!objPessoa.validarCampos()) {
                console.log("Verifique se todos os campos foram preenchidos na pessoa");
                return res.json({ message: "O arquivo informado possui informações faltantes na pessoa" });
            }
            if (!objPessoa.validaCpf()) {
                console.log("CPF inválido");
                return res.json({ message: "CPF inválido" });
            }

            const result = await updatePessoa(id, objPessoa);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Pessoa não encontrada" });
            }

            return res.json({ message: "Pessoa atualizada com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    deletarPessoa: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await deletePessoa(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Pessoa não encontrada" });
            }

            return res.json({ message: "Pessoa deletada com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },


    adicionarLogin: async (req, res) => {
        try {
            const { pessoaId, login, senha, perfil } = req.body;

            
            console.log("Valor de pessoaId:", pessoaId);

            const result = await insertLoginProfile(login, senha, pessoaId, perfil);

            return res.json(result);
        } catch (error) {
            console.error(error);
            res.json({ error: error.message });
        }
    }
};

module.exports = PessoaController;

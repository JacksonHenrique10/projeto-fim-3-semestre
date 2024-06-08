const conectarBancoDeDados = require('../config/db');

async function insertFuncionario(cliente, endereco, telefones, funcionario) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        const [resEnd] = await connection.query('INSERT INTO tbl_endereco (logradouro, bairro, estado, numero, complemento, cep) VALUES (?, ?, ?, ?, ?, ?)',
            [endereco.logradouro, endereco.bairro, endereco.estado, endereco.numero, endereco.complemento, endereco.cep]);
        const [resPessoa] = await connection.query('INSERT INTO tbl_pessoa (cpf, nome, data_nasc, genero, email, endereco_id) VALUES (?, ?, ?, ?, ?, ?)',
            [cliente.cpf, cliente.nome, cliente.data_nasc, cliente.genero, cliente.email, resEnd.insertId]);
        const [resFunc] = await connection.query('INSERT INTO tbl_funcionario (data_admissao, crm, pessoa_id, pessoa_endereco_id) VALUES (?, ?, ?, ?)',
            [funcionario.data_admissao, funcionario.crm, resPessoa.insertId, resEnd.insertId]);

        for (let tel of telefones) {
            const [resTel] = await connection.query('INSERT INTO tbl_telefone (numero) VALUES (?)', [tel.numero]);
            await connection.query('INSERT INTO tbl_pessoa_has_tbl_telefone (pessoa_id, telefone_id, pessoa_tbl_endereco_id) VALUES (?, ?, ?)',
                [resPessoa.insertId, resTel.insertId, resEnd.insertId]);
        }

        await connection.commit();
        console.log('Transação concluída com sucesso.');
        return 'Transação concluída com sucesso.';
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw error;
    } finally {
        connection.end(null);
    }
}

async function insertPaciente(cliente, endereco, telefones, paciente) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        const [resEnd] = await connection.query('INSERT INTO tbl_endereco (logradouro, bairro, estado, numero, complemento, cep) VALUES (?, ?, ?, ?, ?, ?)',
            [endereco.logradouro, endereco.bairro, endereco.estado, endereco.numero, endereco.complemento, endereco.cep]);
        const [resPessoa] = await connection.query('INSERT INTO tbl_pessoa (cpf, nome, data_nasc, genero, email, endereco_id) VALUES (?, ?, ?, ?, ?, ?)',
            [cliente.cpf, cliente.nome, cliente.data_nasc, cliente.genero, cliente.email, resEnd.insertId]);
        const [resPac] = await connection.query('INSERT INTO tbl_paciente (pessoa_id) VALUES (?)', [resPessoa.insertId]);

        for (let tel of telefones) {
            const [resTel] = await connection.query('INSERT INTO tbl_telefone (numero) VALUES (?)', [tel.numero]);
            await connection.query('INSERT INTO tbl_pessoa_has_tbl_telefone (pessoa_id, telefone_id, pessoa_tbl_endereco_id) VALUES (?, ?, ?)',
                [resPessoa.insertId, resTel.insertId, resEnd.insertId]);
        }

        await connection.commit();
        console.log('Transação concluída com sucesso.');
        return 'Transação concluída com sucesso.';
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw error;
    } finally {
        connection.end(null);
    }
}

async function insertLoginProfile(login, senha, pessoaId, perfil) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        const [resPessoa] = await connection.query('SELECT endereco_id FROM tbl_pessoa WHERE id = ?', [pessoaId]);

        if (resPessoa.length === 0) {
            throw new Error('Pessoa não encontrada.');
        }

        const [resLogin] = await connection.query('INSERT INTO tbl_login (login, senha, pessoa_id, status, pessoa_endereco_id) VALUES (?, ?, ?, ?, ?)',
            [login, senha, pessoaId, 1, resPessoa[0].endereco_id]);

        for (let p of perfil) {
            await connection.query('INSERT INTO tbl_perfis (tipo, login_id, login_pessoa_id, login_pessoa_endereco_id) VALUES (?, ?, ?, ?)',
                [p.tipo, resLogin.insertId, pessoaId, resPessoa[0].endereco_id]);
        }

        await connection.commit();
        console.log('Transação de login e perfil concluída com sucesso.');
        return 'Transação de login e perfil concluída com sucesso.';
    } catch (error) {
        if (error.message === 'Pessoa não encontrada.') {
            console.error('Pessoa não encontrada para o ID:', pessoaId);
            throw new Error('Pessoa não encontrada.');
        } else {
            await connection.rollback();
            console.error(error);
            throw error;
        }
    } finally {
        connection.end(null);
    }
}

async function selectPessoaId(pessoaId) {
    const connection = await conectarBancoDeDados();
    try {
        const [results] = await connection.query('SELECT * FROM tbl_pessoa WHERE id = ?', [pessoaId]);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        connection.end(null);
    }
}

async function updatePessoa(id, cliente) {
    const connection = await conectarBancoDeDados();
    try {
        const [result] = await connection.query(
            'UPDATE tbl_pessoa SET cpf = ?, nome = ?, data_nasc = ?, genero = ?, email = ? WHERE id = ?',
            [cliente.cpf, cliente.nome, cliente.data_nasc, cliente.genero, cliente.email, id]
        );
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        connection.end(null);
    }
}

async function deletePessoa(id) {
    const connection = await conectarBancoDeDados();
    try {
        const [result] = await connection.query(
            'DELETE FROM tbl_pessoa WHERE id = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        connection.end(null);
    }
}

module.exports = { insertFuncionario, insertPaciente, insertLoginProfile, selectPessoaId, updatePessoa, deletePessoa };




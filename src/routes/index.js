const express = require("express");
const router = express.Router();

const PessoaController = require("../controllers/PessoaController");

// Rota para adicionar uma pessoa
router.post('/pessoa', PessoaController.adicionarPessoa);
router.post('/login', PessoaController.adicionarLogin);
router.get('/pessoa/:id', PessoaController.buscarPessoa);
router.put('/pessoa/:id', PessoaController.atualizarPessoa);
router.delete('/pessoa/:id', PessoaController.deletarPessoa);

// Outras rotas
// router.get("/", Controller.index)
// router.get("/cadastro", Controller.cadastro)
// router.get("/listar", Controller.listar);
// router.get('/editar/:id', Controller.editar);
// router.post('/editar/usuario', Controller.salvarEdicao);
// router.get('/:id', Controller.selecionar);
// router.delete('/excluir/:id', Controller.deletarUsuario);

// Rota de erro 404
// router.use(function(req, res){
//     res.status(404).render(`pages/pag_erro`, {message:'404 - Página não encontrada'})
// })

module.exports = router;

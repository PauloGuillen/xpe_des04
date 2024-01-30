const express = require('express');
const router = express.Router();
const db = require('./db');
const { check, validationResult } = require('express-validator');

router.get("/", getProdutos);

router.post("/", 
  check('Codigo', 'Codigo deve ser informado').notEmpty(),
  check('Descricao', 'Descricao deve ser informado').notEmpty(),
  check('Preco', 'O preço deve ser um número').notEmpty().isFloat(),
  createProduto
);

router.put("/", 
  check('Codigo', 'Codigo deve ser informado').notEmpty(),
  check('Descricao', 'Descricao deve ser informado').notEmpty(),
  check('Preco', 'O preço deve ser um número').notEmpty().isFloat(),
  updateProduto
);

router.delete("/:Codigo", deleteProduto);

async function getProdutos(req, res) {
  let produtos = await db.produto.findAll();

  res.status(200).json(produtos)
}

async function getProduto(Codigo) {
  return await db.produto.findByPk(Codigo, { raw: true })
  // return await db.produto.findOne({ where: { Codigo: Codigo } });
}

async function createProduto(req, res) {
  const erros = validationResult(req);
  if (!erros.isEmpty() || req.body.Preco < 0) {
    return res.status(400).json({ erro: erros.array() });
  }

  const payload = {
    Codigo: req.body.Codigo,
    Descricao: req.body.Descricao,
    Preco: req.body.Preco,
  }

  const produtoGet = await db.produto.findByPk(payload.Codigo, { raw: true })
  // const produtoGet = getProduto(payload.Codigo)

  if (produtoGet) {
    await db.produto.update(payload, {
      where: {
        Codigo: payload.Codigo,
      },
    })
    const produtoAlt = await db.produto.findByPk(payload.Codigo, { raw: true })
    res.status(200).send(produtoAlt)
    res.end()
    return
  }

  const produto = await db.produto.create(payload);
  res.status(201).send(produto)
  res.end()
}


async function updateProduto(req, res) {
  const erros = validationResult(req);
  if (!erros.isEmpty() || req.body.Preco < 0) {
    return res.status(400).json({ erro: erros.array() });
  }

  const payload = {
    Codigo: req.body.Codigo,
    Descricao: req.body.Descricao,
    Preco: req.body.Preco,
  }

  const produtoGet = await db.produto.findByPk(payload.Codigo, { raw: true })

  if (!produtoGet) {
    res.status(405)
    res.end()
    return
  }

  await db.produto.update(payload, {
    where: {
      Codigo: payload.Codigo,
    },
  })
  const produtoAlt = await db.produto.findByPk(payload.Codigo, { raw: true })
  res.status(200).send(produtoAlt)
  res.end()
}

async function deleteProduto(req, res) {
  const Codigo = req.params.Codigo

  const produtoGet = await db.produto.findByPk(Codigo, { raw: true })

  if (!produtoGet) {
    res.status(405).send({"error": "Produto inexistente"})
    res.end()
    return
  }

  await db.produto.destroy({
    where: {
      Codigo: Codigo,
    },
  })
  res.status(200)
  res.end()
}


module.exports = router

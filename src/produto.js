const express = require('express');
const router = express.Router();
const db = require('./db');
const { check, validationResult } = require('express-validator');

router.get("/", async (req, res) => {
  let produtos = await db.produto.findAll();

  res.status(200).json(produtos)
});

router.post("/", 
  check('Codigo', 'Codigo deve ser informado').notEmpty(),
  check('Descricao', 'Descricao deve ser informado').notEmpty(),
  check('Preco', 'O preço deve ser um número').notEmpty().isFloat(),

  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty() || req.body.Preco < 0) {
      return res.status(400).json({ erro: erros.array() });
    }

    const produto = await db.produto.create({
      Codigo: req.body.Codigo,
      Descricao: req.body.Descricao,
      Preco: req.body.Preco,
    });

    res.status(201).send(produto)
    res.end()
  }
);


// router.post("/", ProductController.createProduct);
// router.get("/info", ProductController.getProductsInfo);
// router.get("/:id", ProductController.getProduct);
// router.delete("/:id", ProductController.deleteProduct);
// router.put("/", ProductController.updateProduct);
// router.post("/info", ProductController.createProductInfo);
// router.put("/info", ProductController.updateProductInfo);
// router.delete("/info/:id", ProductController.deleteProductInfo);
// router.post("/review", ProductController.createReview);
// router.delete("/:id/review/:index", ProductController.deleteReview);

module.exports = router

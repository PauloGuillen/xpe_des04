const express = require('express')
const request = require('supertest');

const db = require('../src/db');

const app = express().use(express.json()).use('/', require('../src/app'))

describe('Testes de Integração de Produutos', () => {
  
  beforeEach(async () => {
    await db.produto.destroy({ where: {} });
  });

  afterAll(async () => db.sequelize.close());

  const produtoiPhone = {
    Codigo: 'AF1010',
    Descricao: 'Apple iPhone 14 128GB Meia-noite 6,1',
    Preco: 4199.56,
  };

  test('GET /produto', async () => {
    await db.produto.create(produtoiPhone);

    const res = await request(app).get('/produto')
    
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot([produtoiPhone]);
  })

  test('POST /produto - payload inválido', async () => {
    const produtoInvalidoCodigo = {
      Descricao: 'Apple iPhone 14 128GB Meia-noite 6,1',
      Preco: 4199.56,
    };
    let res = await  request(app).post('/produto').send(produtoInvalidoCodigo)
    expect(res.status).toBe(400)

    const produtoInvalidoDescricao = {
      Codigo:produtoiPhone.Codigo,
      Preco: 4199.56,
    };
    res = await  request(app).post('/produto').send(produtoInvalidoDescricao)
    expect(res.status).toBe(400)

    const produtoInvalidoPreco = {
      Codigo:produtoiPhone.Codigo,
      Descricao: 'Apple iPhone 14 128GB Meia-noite 6,1',
    };
    res = await  request(app).post('/produto').send(produtoInvalidoPreco)
    expect(res.status).toBe(400)

    const produtoInvalidoPrecoNegativo = {
      Codigo:produtoiPhone.Codigo,
      Descricao: 'Apple iPhone 14 128GB Meia-noite 6,1',
      Preco: -1,
    };
    res = await  request(app).post('/produto').send(produtoInvalidoPrecoNegativo)
    expect(res.status).toBe(400)
  })

  test('POST /produto - incluindo um produto inexistente', async () => {
    const res = await  request(app).post('/produto').send(produtoiPhone)
    
    expect(res.status).toBe(201)
    expect(res.body).toMatchSnapshot(produtoiPhone);

    // Produto foi armazenado
    const produto = await db.produto.findOne({ where: { Codigo: produtoiPhone.Codigo } });
    expect(produto.Codigo).toBe(produtoiPhone.Codigo);
  })

  test('POST /produto - alterar um produto existente', async () => {
    await db.produto.create(produtoiPhone);

    const produtoAlterado = {
      Codigo: 'AF1010',
      Descricao: 'Apple iPhone 14',
      Preco: 3014.99,
    };

    const res = await  request(app).post('/produto').send(produtoAlterado)
    
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot(produtoAlterado);

    // Produto foi armazenado
    const produto = await db.produto.findOne({ where: { Codigo: produtoiPhone.Codigo } });
    expect(produto.Descricao).toBe(produtoAlterado.Descricao);
  })


  test('PUT /produto - payload inválido', async () => {
    const produtoInvalidoCodigo = {
      Descricao: 'Apple iPhone 14 128GB Meia-noite 6,1',
      Preco: 4199.56,
    };
    let res = await  request(app).put('/produto').send(produtoInvalidoCodigo)
    expect(res.status).toBe(400)

    const produtoInvalidoDescricao = {
      Codigo:produtoiPhone.Codigo,
      Preco: 4199.56,
    };
    res = await  request(app).put('/produto').send(produtoInvalidoDescricao)
    expect(res.status).toBe(400)

    const produtoInvalidoPreco = {
      Codigo:produtoiPhone.Codigo,
      Descricao: 'Apple iPhone 14 128GB Meia-noite 6,1',
    };
    res = await  request(app).put('/produto').send(produtoInvalidoPreco)
    expect(res.status).toBe(400)

    const produtoInvalidoPrecoNegativo = {
      Codigo:produtoiPhone.Codigo,
      Descricao: 'Apple iPhone 14 128GB Meia-noite 6,1',
      Preco: -1,
    };
    res = await  request(app).put('/produto').send(produtoInvalidoPrecoNegativo)
    expect(res.status).toBe(400)
  })

  test('PUT /produto - produto inexistente', async () => {
    const res = await  request(app).put('/produto').send(produtoiPhone)
    
    expect(res.status).toBe(405)
  })

  test('PUT /produto - alterar um produto existente', async () => {
    await db.produto.create(produtoiPhone);

    const produtoAlterado = {
      Codigo: 'AF1010',
      Descricao: 'Apple iPhone 14',
      Preco: 3014.99,
    };

    const res = await  request(app).put('/produto').send(produtoAlterado)
    
    expect(res.status).toBe(200)
    expect(res.body).toMatchSnapshot(produtoAlterado);

    // Produto foi armazenado
    const produto = await db.produto.findOne({ where: { Codigo: produtoiPhone.Codigo } });
    expect(produto.Descricao).toBe(produtoAlterado.Descricao);
  })

  test('DELETE /produto - produto inexistente', async () => {
    const res = await  request(app).delete('/produto/prdinex')
    
    expect(res.status).toBe(405)
  })

  test('DELETE /produto - excluir um produto', async () => {
    await db.produto.create(produtoiPhone);

    const res = await  request(app).delete(`/produto/${produtoiPhone.Codigo}`)
    
    expect(res.status).toBe(200)
  })
});

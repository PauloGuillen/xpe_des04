const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  host: 'localhost',
  port: 49153,
  database: 'consulta_credito',
  username: 'postgres',
  password: 'mysecretpassword',
  storage: "./src/database.sqlite",
  logging: false,
});


// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: 'db',
//   port: 5432,
//   database: 'consulta_credito',
//   username: 'postgres',
//   password: 'mysecretpassword',
//   logging: false,
// });

const clienteModel = (sequelizeCliente, DataTypes) => {
  const Cliente = sequelizeCliente.define('Clientes', {
    CPF: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    Nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Cliente;
};

const consultaModel = (sequelizeConsulta, DataTypes) => {
  const Consulta = sequelizeConsulta.define('Consultas', {
    Valor: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    NumPrestacoes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Juros: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Montante: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Prestacoes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Consulta;
};

const cliente = clienteModel(sequelize, Sequelize.DataTypes);
const consulta = consultaModel(sequelize, Sequelize.DataTypes);

cliente.hasMany(consulta, { as: 'Consultas' });
consulta.belongsTo(cliente);

const produtoModel = (sequelizeProduto, DataTypes) => {
  const Produto = sequelizeProduto.define('Produto', {
    Codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    Descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Preco: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  });

  return Produto;
};

const produto = produtoModel(sequelize, Sequelize.DataTypes);

module.exports = {
  cliente,
  consulta,
  produto,
  sequelize,
};

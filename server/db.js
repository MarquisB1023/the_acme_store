const pg = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "secret";
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_shop"
);

module.exports = client;

// const createTables = async () => {
//   const SQL = `

//   DROP TABLE IF EXISTS favorites CASCADE;
//   DROP TABLE IF EXISTS users CASCADE;
//   DROP TABLE IF EXISTS products CASCADE;

//   CREATE TABLE products(
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     name VARCHAR(255) NOT NULL
//     );

//     CREATE TABLE users(
//         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//         name VARCHAR(255) NOT NULL,
//         password VARCHAR(255) NOT NULL
//         );

//        CREATE TABLE favorites(
//         id UUID PRIMARY KEY,
//         users_id UUID REFERENCES users(id),
//         products_id UUID REFERENCES products(id),
//         CONSTRAINT unique_product_user UNIQUE (user_id,products_id)
//         );

//         INSERT INTO  users (name, password) VALUES ('Dillard','password');
//         INSERT INTO  users (name, password ) VALUES ('Tony','password');
//         INSERT INTO  users(name, password) VALUES ('Michael','password');
//         INSERT INTO  users(name, password) VALUES ('Morty','password');

//         INSERT INTO products (id) VALUES('T-shirt');
//         INSERT INTO products (id) VALUES('Key-chain');
//         INSERT INTO products (id) VALUES('funpops');
//         INSERT INTO products (id) VALUES('Flashlight');

//         INSERT INTO favorites (product_id) VALUES ('UUID');
//         INSERT INTO favorites (product_id) VALUES('UUID');
//         INSERT INTO favorites (product_id) VALUES('UUID');
//         INSERT INTO favorites (product_id) VALUES('UUID');
//         `;
//   await client.query(SQL, [
//     await bcrypt.hash("password", 5),
//     await bcrypt.hash("password", 5),
//     await bcrypt.hash("password", 5),
//     await bcrypt.hash("password", 5),
//   ]);
// };

const createTables = async () => {
  const UUID = "uuid";
  try {
    await client.query("DROP TABLE IF EXISTS favorites CASCADE;");
    await client.query("DROP TABLE IF EXISTS users CASCADE;");
    await client.query("DROP TABLE IF EXISTS products CASCADE;");
    await client.query(`
          CREATE TABLE products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL
          );
        `);
    await client.query(`
          CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
          );
        `);
    await client.query(`
          CREATE TABLE favorites (
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            product_id UUID REFERENCES products(id),
            CONSTRAINT unique_product_user UNIQUE (user_id, product_id)
          );
        `);
    await client.query(
      `
          INSERT INTO users (name, password) VALUES
            ('Dillard', $1),
            ('Tony', $2),
            ('Michael', $3),
            ('Morty', $4);
        `,
      [
        await bcrypt.hash("password", 5),
        await bcrypt.hash("password", 5),
        await bcrypt.hash("password", 5),
        await bcrypt.hash("password", 5),
      ]
    );
    await client.query(`
          INSERT INTO products (name) VALUES
            ('T-shirt'),
            ('Key-chain'),
            ('funpops'),
            ('Flashlight');
        `);
    await client.query(`
          INSERT INTO favorites (id, product_id) VALUES
            ('${UUID}', 'T-shirt'),
            ('${UUID}', 'Key-chain'),
            ('${UUID}', 'funpops'),
            ('${UUID}', 'Flashlight');
        `);
  } catch (error) {
    console.error("Error executing SQL queries:", error);
  }
};

const autheticateUser = async () => {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE name = $1
    `;
  const response = await client.query(SQL, [username]);
  userInfo = response.rows;
  if (
    userInfo.length ||
    (await bcrypt.compare(userInfo[0].password, password))
  ) {
    const error = Error("Not Authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  console.log(token, "here");
  return { token: token };
};

const createUser = async (name, password) => {
  const SQL = `
  INSERT INTO  users (name, password) 
  VALUES ($1, $2)
   RETURNING *;
    `;
  const response = await client.query(
    SQL,
    [name, password][await bcrypt.hash("password", 5)]
  );
  return response.rows;
};
const createProducts = async (products_id) => {
  const SQL = `
  INSERT INTO  products (name) 
  VALUES ($1, $2)
   RETURNING *;
    `;
  const response = await client.query(SQL, [await bcrypt.hash("password", 5)]);
  return response.rows;
};

const fetchUsers = async (client, user_id) => {
  const SQL = `
    SELECT * from users
    WHERE id =$1
    `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const fetchProducts = async (products_id) => {
  const SQL = `
    SELECT * from products
    WHERE id =$1
    `;
  const response = await client.query(SQL, [products_id]);

  return response.rows;
};

const fetchFavorites = async (user_id, products_id) => {
  const SQL = `
  SELECT *
  FROM favorites
  WHERE user_id = $1
    `;
  const response = await client.query(SQL, [user_id, products_id]);

  return response.rows;
};

const addFavorites = async (user_id, products_id) => {
  const SQL = `
    INSERT INTO users_products(id, user_id,products_id)
    VALUES($1 ,$2, $3)
    `;
  const response = await client.query(SQL, [UUID.v4(), user_id, products_id]);
  return response.rows;
};

const destoryFavorites = async (user_id, products_id) => {
  const SQL = `
      DELETE FROM users_products(id, user_id,products_id)

      where id  = $1
      `;
  const response = await client.query(SQL, [UUID.v4(), user_id, products_id]);
  return response.rows;
};

module.exports = {
  createTables,
  client,
  autheticateUser,
  createUser,
  createProducts,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  addFavorites,
  destoryFavorites,
};

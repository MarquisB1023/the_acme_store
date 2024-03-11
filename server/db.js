const pg = require("pg");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const JWT = proess.env.JWT || "secret"
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_shop"
);


module.exports = client;
const UUID = "uuid";



const createTables = async () => {
  const dropTables = `

    `;

  const createTables = `
 

    `;

  const SQL = `

  DROP TABLE IF EXISTS favorites CASCADE;
  DROP TABLE IF EXISTS users CASCADE;
  DROP TABLE IF EXISTS products CASCADE;
 
  CREATE TABLE products(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL
    );
   
    CREATE TABLE users(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
        );
    
       CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        skill_id UUID REFERENCES products(id),
        CONSTRAINT unique_skill_user UNIQUE (user_id,skill_id)
        );

        INSERT INTO  users (name, password) VALUES ('Frank','password');
        INSERT INTO  users (name, password ) VALUES ('jake','password');
        INSERT INTO  users(name, password) VALUES ('gill','password');
        INSERT INTO  users(name, password) VALUES ('Mate','password');

        INSERT INTO products (id) VALUES('dancing');
        INSERT INTO products (id) VALUES('Singing');
        INSERT INTO products (id) VALUES('SwordJuggling');
        INSERT INTO products (id) VALUES('violin');
        
        INSERT INTO favorites (id) VALUES ('UUID');
        INSERT INTO favorites (id) VALUES('UUID');
        INSERT INTO favorites (id) VALUES('UUID');
        INSERT INTO favorites (id) VALUES('UUID');
        `;
  await client.query(SQL,[await bcrypt.hash("password",5),await bcrypt.hash("password",5),await bcrypt.hash("password",5),await bcrypt.hash("password",5)]);
};

const autheticateUser = async ()=>{
    const SQL = `
    SELECT id, password
    FROM users
    WHERE name = $1
    `
    const response = await client.query(SQL,[username])
    userInfo = response.rows
    if(userInfo.length || await bcrypt.compare(userInfo[0].password,password)) {
    const error = Error('Not Authorized')
  error.status = 401
  throw error
}
const token = await jwt.sign({id: response.rows[0].id},JWT)
console.log(token,"here")
return {token:token}
}

const createUser = async (name,password)=>{
  const SQL = `
  INSERT INTO  users (name, password) 
  VALUES ($1, $2)
   RETURNING *;
    `;
  const response = await client.query(SQL,[name,password][await bcrypt.hash("password",5)]);
  return response.rows;
}
const createproducts = async (products_id) => {
  const SQL = `
  INSERT INTO  products (name) 
  VALUES ($1, $2)
   RETURNING *;
    `;
  const response = await client.query(SQL,[await bcrypt.hash("password",5)]);
  return response.rows;
};


const fetchUsers = async (user_id) => {
  const SQL = `
    SELECT * from users
    WHERE id =$1
    `;
  const response = await client.query(SQL,[user_id]);
  return response.rows;
};

const fetchproducts = async (products_id) => {
  const SQL = `
    SELECT * from products
    WHERE id =$1
    `;
  const response = await client.query(SQL,[products_id]);

  return response.rows;
};

const fetchUserproducts = async (user_id,products_id) => {
  const SQL = `
  SELECT *
  FROM favorites
  WHERE user_id = $1
    `;
  const response = await client.query(SQL,[user_id,products_id]);

  return response.rows;
};

const addUsersproducts = async (user_id, skill_id) => {
  const SQL = `
    INSERT INTO users_products(id, userId,skillId)
    VALUES($1 ,$2, $3)
    `;
  const response = await client.query(SQL, [UUID.v4(), user_id, skill_id]);
  return response.rows;
};

module.exports = {
  createTables,
  client,
  autheticateUser,
  createUser,
  createproducts,
  fetchUsers,
  fetchproducts,
  fetchUserproducts,
  addUsersproducts,
};

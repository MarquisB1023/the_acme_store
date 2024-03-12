const express = require("express");

const app = express();

app.use(require("morgan")("dev"));
const port = 8000;
app.use(express.json());

const initFunctions = require("./db");
console.log(initFunctions);
const init = async () => {
  await initFunctions.client.connect();
  await initFunctions.createTables();
  const [user1, user2, user3, user4] = await initFunctions.fetchUsers();
  const [product1, product2, product3, product4] = await initFunctions.fetchProducts();
  const Favorites = await Promise.all([
    initFunctions.client.addFavorites(user1.id, user2.id),
    initFunctions.client.addFavorites(user1.id, product2.id),
    initFunctions.client.addFavorites(user2.id, product3.id)
  ]);

  /* return to this later*/
//   const [] = await client.fetch();

  app.listen(port, () => {
    console.log(
      "we are connected to the databaseand it is seeded @ port" + port
    );
  });
};

init();

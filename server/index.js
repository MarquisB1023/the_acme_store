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
  const [user1, user2, user3, user4] = await client.fetchUser();
  const [skill1, skill2, skill3, skill4] = await client.fetchSkills();
  const userSkills = await Promise.all(
    (await client.addUserSkills(user1.id, user2.id),
    client.addUserSkill(user1.id, skill2.id),
    client.addUserSkill(user2.id, skill3.id))
  );

  const [] = await client.fetch();

  app.listen(port, () => {
    console.log(
      "we are connected to the databaseand it is seeded @ port" + port
    );
  });
};

init();

const db = require("./db");
const process = require("process");

(async () => {
  await db.connect();

  await db.insertUser({
    email: "diego@email.com",
    keywords: ["cat", "dog", "movement"]
  });

  await db.insertUser({
    email: "user@email.com",
    keywords: ["butterfly", `popular\ pet`, `Eliminatório\ e\ Classificatório`]
  });

  process.exit(0);
})();

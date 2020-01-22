const db = require("./db");

(async () => {
  await db.connect();

  db.insertUser({
    email: "diego@email.com",
    keywords: ["cat", "dog", "movement"]
  });

  db.insertUser({
    email: "user@email.com",
    keywords: ["butterfly", "popular pet"]
  });
})();

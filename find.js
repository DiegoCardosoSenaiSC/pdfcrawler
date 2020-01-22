const db = require("./db");
const { cmdexec } = require("./utils");

(async () => {
  await db.connect();
  const users = await db.findAllUsers();
  const files = await db.findFiles({ from: "google" });
  console.log(users, files);
  for (user of users) {
    let filesFound = [];
    for (f of files) {
      let found = await cmdexec(
        `pdftotext pdfout/${f.from}/'${
          f.name
        }' - | grep -i -E '${user.keywords.join("|")}'`
      );
      if (found) {
        filesFound.push(f.url);
      }
    }
    if (filesFound.length) {
      db.insertFound({
        userID: user._id,
        files: filesFound,
        notified: false
      });
    }
  }
})();

// db.getCollection('found').aggregate([
//   {
//     "$lookup": {
//       "from": "users",
//       "localField": "userID",
//       "foreignField": "_id",
//       "as": "user"
//     }
//   },
//   {
//     "$project": {
//       user: { $arrayElemAt: [ "$user", 0 ]},
//       files: 1,
//       notified: 1
//     }
//   }
// ])

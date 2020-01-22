const mongo = require("mongodb-single-client");

const connect = () => {
  return new Promise(res => {
    mongo.connect(
      {
        url: "mongodb://root:example@localhost:27017?authMechanism=DEFAULT",
        database: "crw"
      },
      error => {
        if (error) throw error;
        res();
      }
    );
  });
};

const insertFileRef = ({ url, name, from, timestamp }) => {
  mongo("files").insertOne({
    url,
    name,
    from,
    timestamp
  });
};

const insertUser = ({ email, keywords }) => {
  mongo("users").insertOne({
    email,
    keywords
  });
};

const insertFound = ({ userID, files, notified }) => {
  mongo("found").insertOne({
    userID,
    files,
    notified
  });
};

const findAllUsers = () => {
  return new Promise(res => {
    mongo("users")
      .find({})
      .toArray((err, items) => {
        res(items);
      });
  });
};

const findFiles = ({ from }) => {
  return new Promise(res => {
    mongo("files")
      .find({ from })
      .toArray((err, items) => {
        res(items);
      });
  });
};

module.exports = {
  connect,
  insertFileRef,
  insertUser,
  insertFound,
  findAllUsers,
  findFiles
};

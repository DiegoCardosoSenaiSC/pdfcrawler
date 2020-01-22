var { exec } = require("child_process");

const cmdexec = cmd => {
  return new Promise(res => {
    exec(cmd, function(x, z) {
      res(z.length ? z.split("\n") : null);
    });
  });
};

module.exports = {
  cmdexec
};

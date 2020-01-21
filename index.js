var Crawler = require("crawler");
var { exec } = require("child_process");

var c = new Crawler({
  maxConnections: 10,
  callback: function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;
      console.log($("title").text());
    }
    done();
  }
});

c.queue([
  {
    uri: "https://www.google.com/search?q=animals%2Bpdf",
    jQuery: true,
    callback: async function(error, res, done) {
      if (error) {
        console.log(error);
      } else {
        await findhref(res);
        const files = await promesify(
          "for f in $(ls pdfout); do echo $f; done"
        );
        for (f of files.split("\n")) {
          let found = await promesify(
            `pdftotext pdfout/${f} - | grep -i 'rabbit'`
          );
          console.log(`${f}: ${found ? "" : "not "}found`);
        }
      }
      done();
    }
  }
]);

function promesify(cmd) {
  return new Promise(res => {
    exec(cmd, function(x, z) {
      res(z);
    });
  });
}

function findhref(response) {
  return new Promise(res => {
    const $ = response.$;
    const target = $("a"),
      qty = target.length;
    target.each(async (idx, el) => {
      var href = $(el).attr("href");
      const [i, link] = href.match(/url\?q=(.*\.pdf)/) || [,];
      if (link) {
        await promesify("wget -nc -P pdfout " + link);
      }
      if (idx === qty - 1) {
        res();
      }
    });
  });
}

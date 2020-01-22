var Crawler = require("crawler");
const db = require("./db");
const { validKeywords } = require("./defines");
const { cmdexec } = require("./utils");

(async () => {
  await db.connect();

  var executor = new Crawler({
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

  function collect(url, provider) {
    executor.queue([
      {
        uri: url,
        jQuery: true,
        callback: async (error, res, done) => {
          if (error) {
            console.log(error);
            done();
          }

          const urls = await findhref(res, provider);
          const files = await cmdexec("ls pdfout/" + provider);

          for (f of files) {
            if (f.length) {
              let found = await cmdexec(
                `pdftotext pdfout/${provider}/'${f}' - | grep -i -E '${validKeywords.join(
                  "|"
                )}'`
              );
              if (found) {
                db.insertFileRef({
                  name: f,
                  url: urls[urls.findIndex(el => decodeURI(el).indexOf(f) > 0)],
                  from: provider,
                  timestamp: Date.now()
                });
              }
              // console.log(`${f}: ${found ? "" : "not "}found`);
            }
          }
          done();
        }
      }
    ]);
  }

  collect(
    "https://www.google.com.br/search?q=animals+exercices%2Bpdf",
    "google"
  );

  function findhref(response, provider) {
    return new Promise(res => {
      var links = [];
      const $ = response.$;
      const target = $("a");

      target.each((_, el) => {
        let href = $(el).attr("href");
        const [, link] = href.match(/url\?q=(.*\.pdf)/) || [,];
        if (link) {
          links.push(decodeURI(link));
        }
      });

      var qty = links.length,
        count = 0;
      links.forEach(async link => {
        await cmdexec("wget -nc -P pdfout/" + provider + " " + link);
        count++;
        if (count === qty) {
          res(links);
        }
      });
    });
  }
})();

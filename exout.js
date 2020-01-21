const { exec } = require("child_process");

exec(
  "for f in $(ls pdfout); do pdftotext pdfout/${f} - | grep -i 'textonaoencontrado'; done",
  (a, b) => {
    console.log(b.length);
  }
);

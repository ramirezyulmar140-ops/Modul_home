const fs = require('fs');
const PDFParser = require('pdf2json');
let pdfParser = new PDFParser(this, 1);
pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));
pdfParser.on('pdfParser_dataReady', pdfData => {
    fs.writeFileSync('pdf_out.txt', pdfParser.getRawTextContent());
    console.log('SUCCESS');
});
pdfParser.loadPDF('d:/Проекты домов/Новая папка (2)/modular-houses-landing/4294846938.pdf');

const fs=require('fs');
const pdf=require('pdf-parse');
const pdfFunc = typeof pdf === 'function' ? pdf : (pdf.default || pdf.pdf);
pdfFunc(fs.readFileSync('d:/Проекты домов/Новая папка (2)/modular-houses-landing/4294846938.pdf')).then(d => {
  fs.writeFileSync('pdf_out.txt', d.text);
  console.log('SUCCESS');
}).catch(e => console.error('ERROR:', e));

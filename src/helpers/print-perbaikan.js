function closeIframe() {
  document.body.removeChild(this.parentIframe);
}

function setPrint() {
  this.contentWindow.parentIframe = this;
  this.contentWindow.onbeforeunload = closeIframe;
  this.contentWindow.onafterprint = closeIframe;
  this.contentWindow.focus();
  this.contentWindow.print();
}

function printPage(data) {
  const htmlSrc = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>verbalrokum</title><style>@page{margin:0;size:A4 portrait}body{margin:0;font-family:Arial}.sheet{margin:0;overflow:hidden;position:relative;box-sizing:border-box;page-break-after:always}.sheet.padding-5mm{padding:5mm}body.A4 .sheet{width:210mm;height:296mm}@media screen{body{background:#e0e0e0}.sheet{background:white;box-shadow:0 .5mm 2mm rgba(0, 0, 0, .3);margin:5mm auto}}@media print{body.A4{width:210mm}}.center{text-align:center;margin:auto}.form-container{display:flex;flex-direction:column;height:100%}.form-item{flex:1;margin-bottom:auto}.kop{display:flex;flex-direction:row}.kop-logo,.kop-text{text-align:center;margin:auto}.kop-text h1{font-size:13pt}.kop-text h2{font-size:11pt}.kop-text address{font-size:7pt;font-style:normal}.kop-text h1, .kop-text h2{-webkit-margin-before:0;-webkit-margin-after:0;font-weight:bold}.content{font-size:11pt}table{margin-top:5mm;border-collapse:collapse;width:100%}table,td{border:1px solid black;padding:2mm}.content h1{font-size:13pt}.content p{text-indent:10mm}.content .ttd{position:relative;left:120mm;text-align:center;width:40mm}.ttd hr{margin-top:15mm}</style></head><body class="A4"> <section class="sheet padding-5mm"><div class="form-container"><div class="form-item"><div class="kop"><div class="kop-logo"> <img src="https://www.kemenkeu.go.id/images/icon/logo_single.svg"></div><div class="kop-text"><h1>KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</h1><h2>SEKRETARIAT JENDERAL</h2><h2>BIRO HUKUM</h2> <br> <address>GEDUNG DJUANDA I LANTAI 13-14, JALAN DR. WAHIDIN NOMOR 1, JAKARTA PUSAT 10710, KOTAK POS 21</address> <address>TELEPON (021) 3449230 PESAWAT 6378; FAKSIMILI (021) 3811914; SITUS www.kemenkeu.go.id</address></div></div><hr><div class="content"><h1 class="center">KARTU KONTROL PERBAIKAN VERBAL</h1><table><tr><td>No Agenda</td><td>${data.nomorAgenda}</td><td>Tanggal</td><td>${data.tanggal}</td></tr><tr><td>Bagian</td><td>${data.bagian}</td><td>Konseptor</td><td>${data.konseptor}</td></tr><tr><td>ND Bagian</td><td>${data.notaBag}</td><td>Verbal Bagian</td><td>${data.verbBag}</td></tr><tr style="height:25mm"><td>Perihal</td><td colspan="3">${data.perihal}</td></tr><tr style="height:25mm"><td>Catatan Perbaikan</td><td colspan="3">${data.catatan}</td></tr><tr><td>Diterima oleh</td><td></td><td>Tanggal/Jam</td><td></td></tr><tr><td>Diajukan kembali</td><td></td><td>Tanggal/Jam</td><td></td></tr></table></div></div><div class="form-item" style="border-top: 1px dashed black; padding-top: 5mm;"><div class="kop"><div class="kop-logo"> <img src="https://www.kemenkeu.go.id/images/icon/logo_single.svg"></div><div class="kop-text"><h1>KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</h1><h2>SEKRETARIAT JENDERAL</h2><h2>BIRO HUKUM</h2> <br> <address>GEDUNG DJUANDA I LANTAI 13-14, JALAN DR. WAHIDIN NOMOR 1, JAKARTA PUSAT 10710, KOTAK POS 21</address> <address>TELEPON (021) 3449230 PESAWAT 6378; FAKSIMILI (021) 3811914; SITUS www.kemenkeu.go.id</address></div></div><hr><div class="content"><h1 class="center">FORM PENGAJUAN PERBAIKAN VERBAL</h1> <span>Yth. Kepala Biro Hukum,</span><p>Konsep Naskah Dinas terlampir telah kami perbaiki sesuai catatan Ibu pada verbal / konsep naskah sebelumnya.</p><table><tr><td>No Agenda</td><td>${data.nomorAgenda}</td><td>Tanggal</td><td>${data.tanggal}</td></tr><tr style="height:10mm"><td>Perihal</td><td colspan="3">${data.perihal}</td></tr><tr style="height:10mm"><td>Catatan Perbaikan</td><td colspan="3">${data.catatan}</td></tr><tr style="height:15mm"><td>Jawaban / Tanggapan</td><td colspan="3"></td></tr></table><p>Demikian disampaikan, atas perhatian Ibu diucapkan terima kasih.</p><div class="ttd"> <span>Kepala Bagian ${data.bagian}</span><hr></div></div></div></div> </section></body></html>`;
  const hiddenFrame = document.createElement('iframe');
  hiddenFrame.onload = setPrint;
  hiddenFrame.style.visibility = 'hidden';
  hiddenFrame.style.position = 'fixed';
  hiddenFrame.style.right = '0';
  hiddenFrame.style.bottom = '0';
  hiddenFrame.srcdoc = htmlSrc;

  document.body.appendChild(hiddenFrame);
}

export default printPage;

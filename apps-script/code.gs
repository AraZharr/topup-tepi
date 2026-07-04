function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ['Transaksi','TopUp','Log'].forEach(name => {
    let s = ss.getSheetByName(name);
    if (!s) { s = ss.insertSheet(name); s.setFrozenRows(1); }
  });
}
function log(level, source, msg) {
  try {
    const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Log');
    if (s) s.appendRow([new Date(), level, source, msg]);
  } catch(e) { console.error(e); }
}
function sendDailyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const s = ss.getSheetByName('Transaksi');
  const data = s ? s.getDataRange().getValues() : [];
  const today = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd');
  const todayTx = data.filter(r => r[7] && r[7].toString().includes(today));
  const body = `Laporan Harian PPOB\nTanggal: ${today}\nTotal: ${todayTx.length}\nSukses: ${todayTx.filter(r=>r[5]==='success').length}\nGagal: ${todayTx.filter(r=>r[5]==='failed').length}`;
  GmailApp.sendEmail(Session.getActiveUser().getEmail(), `📊 Laporan Harian PPOB - ${today}`, body);
}
function setupTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('sendDailyReport').timeBased().everyDays(1).atHour(7).inTimezone('Asia/Jakarta').create();
}
function init() { setupSheet(); setupTriggers(); log('INFO','Init','App Script siap!'); }
function doGet() { return ContentService.createTextOutput(JSON.stringify({status:'OK',app:'TOP PPOB'})); }

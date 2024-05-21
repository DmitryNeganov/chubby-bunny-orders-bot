const logsSheet = doc.getSheetByName("logs");

function logRequest(msgData, answer) {
  var data = logsSheet.getDataRange().getValues();
  logsSheet.appendRow([data.length + 1, msgData.user_name, msgData.text, answer, new Date(Date.now())])

}

function test() {
  logsSheet.appendRow([1, 2, 3, 4, new Date(Date.now())])
  // Logger.log(new Date(Date.now()))
}

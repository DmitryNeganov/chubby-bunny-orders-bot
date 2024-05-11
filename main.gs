const App_link = "https://script.google.com/macros/s/AKfycbxn2q4nPL44U9Gn_yBHnsWCy0ZsP0t22HU6yawPGaCHFWwleemRCOoqcIyXY3TsRvMh/exec";
//после каждого деплоя обновляем значение переменной

const doc = SpreadsheetApp.getActive();
const usersSheet = doc.getSheetByName("users");
const ordersSheet = doc.getSheetByName("orders");
const itemsSheet = doc.getSheetByName("items");

const token = "6319707052:AAHi9Rx4w6fMnbxyHKZ_ymtK0oXKv7v8Ovw";

function api_connector () {
  UrlFetchApp.fetch("https://api.telegram.org/bot"+token+"/setWebHook?url="+App_link); 
}

function send(msg, chat_id) {
  const payload = {
    'method': 'sendMessage',
    'chat_id': String(chat_id),
    'text': msg,
    'parse_mode': 'HTML'
  }
  const data = {
    'method': 'post',
    'payload': payload,
    'muteHttpExceptions': true
  }
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function doPost(e) {
  const update = JSON.parse(e.postData.contents);
  let msgData = {}
  let answer = "";

  if (update.hasOwnProperty('message')) {
    msgData = {
      id         : update.message.message_id,
      chat_id    : update.message.chat.id,
      user_id    : update.message.from.userId,
      user_name  : update.message.from.username,
      text       : update.message.text,
      is_msg     : true
    };
  }

  if (msgData.text == "/hello") {
    answer = "Hello " + msgData.user_name + " - with ID: " + msgData.user_id;
  }
  if (msgData.text == "/actual_orders_status") {
    answer = getUserActualOrders(msgData.user_name)
  }
  
  send(answer, msgData.chat_id);
}



function test() {
  var tmp = getUserActualOrders("yakushchenko");
  Logger.log = tmp;
}


function getUserId(username) {
  Logger.log("username = " + username);
  var data = usersSheet.getDataRange().getValues();
  for(var i = 0; i < data.length; i++){
    if(data[i][1] == username){ //[1] because column B
      Logger.log("userId = " + data[i][0]);
      return data[i][1];
    }
  }
}

function getUserAllOrders(username) {
  var userId = getUserId(username);
  var resultString = "";
  Logger.log("Ваши заказы: ");
  var counter = 0;
  var data = ordersSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] == username) {
      var currentOrder = ++counter + ") 📦 заказ: #<b>" + data[i][0] + "</b> местоположение: <i>" + data[i][2] + "</i> статус: " + data[i][3] + "\n";
      Logger.log(currentOrder);
      resultString = resultString + currentOrder;
      resultString = resultString + getOrderAllItems(data[i][0]);
    } 
  }
  return resultString;
}

function getUserActualOrders(username) {
  var userId = getUserId(username);
  var resultString = "";
  Logger.log("Ваши заказы: ");
  var counter = 0;
  var data = ordersSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
  if (data[i][1] == username  && data[i][3] != "Доставлен покупателю") {
      var currentOrder = ++counter + ") 📦 заказ: #<b>" + data[i][0] + "</b> местоположение: <i>" + data[i][2] + "</i> статус: " + getOrderStatusInfo(i) + "\n";
      Logger.log(currentOrder);
      resultString = resultString + currentOrder;
      resultString = resultString + getOrderAllItems(data[i][0]);
    }
  }
  return resultString;
}

function getOrderStatusInfo(rowNumber) {
  var data = ordersSheet.getDataRange().getValues();
  if (data[rowNumber][3] == "Заказан") {
    var reliseDate
    if (data[rowNumber][4] == "") {
      reliseDate = "Неизвестна"
    } else {
      reliseDate = data[rowNumber][4]
    }
    return data[rowNumber][3] + ", дата релиза: " + reliseDate
  } else {
    return data[rowNumber][3]
  }
}

function getOrderAllItems(orderId) {
  var resultString = "";
  var data = itemsSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] == orderId) {
      var currentItem = "   ⚫️ " + data[i][2] + " - " + data[i][3] + " шт.\n";
      Logger.log(currentItem);
      resultString = resultString + currentItem;
    }
  }
  return resultString;
}


function sendQuestions(chat_id) {
  const questionsArr = questionsSheet.getRange(1,1,questionsSheet.getLastRow(), questionsSheet.getLastColumn()).getValues();

  Logger.log(questionsArr)

  questionsArr.forEach(e => send(e[1],chat_id))

}


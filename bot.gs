const App_link = "https://script.google.com/macros/s/AKfycbw5pBl1qQLDtNolMGd5vK7HBRzyjgDOCgG9EDMOHjtiszNKqrPuMhTRPkPYB_wdRFMj/exec";
//после каждого деплоя обновляем значение переменной

const token = "6800297762:AAE94ZcWmA-CSvoPs-usHcyEHlDRNU8tU6w";

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

function sendKeyboard(chatId) {

  const payload = {
    chat_id: chatId,
    text: 'Выберите запрос',
    reply_markup: {
      inline_keyboard: [
        [
          {text:'Мои заказы',callback_data:'orders'},
        ],
        [
          {text:'Мои оплаты',callback_data:'payments'},
        ],   
        [
          {text:'Оплата доставок',callback_data:'deliveries'},
        ], 
        [
          {text:'Мои заказы у админа',callback_data:'atadmins'},
        ] 
      ]
    }
  };
  const data = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', data);
}

function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  var username = getUserByChatId(chatId).tgUsername;
  if (username == null) {
    return
  }
  const data = callbackQuery.data;

  var answerArray = new Array();

  switch(data) {
    case 'orders':
      send("Пошёл на склад проверять заказы, скоро вернусь 🐰", chatId);
      answerArray = getUserActualOrders(username);
      break;
    case 'payments':
      send("Сейчас посчитаю заказы, которые пора оплачивать 🐰", chatId);
      answerArray = getCreditInfoString(username);
      break;
    case 'deliveries':
      send("Сейчас посчитаю доставки, которые пора оплачивать  🐰", chatId);
      answerArray = getShippingOrdersForPayment(username);
      break;
    case 'atadmins':
      send("Секундочку, уточняю у админа, какие заказы Вам еще не отдали 🐰", chatId);
      answerArray = getAtAdminsOrderInfo(username);
      break;
    default:
      responseText = 'Unknown action.';
  }
  for (var i = 0; i < answerArray.length; i++) {
    send(answerArray[i], chatId); 
    logRequestButton(username, data, answerArray[i])
  }
  sendKeyboard(chatId);
}

function testSendKeyboard() {
  sendKeyboard("1238753976");
}

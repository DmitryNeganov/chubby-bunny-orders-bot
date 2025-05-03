function doPost(e) {
  const update = JSON.parse(e.postData.contents);
  let msgData = {}
  let answer = "";
  var answerArray = new Array();

  if (update.hasOwnProperty('message')) {
    msgData = {
      id         : update.message.message_id,
      chat_id    : update.message.chat.id,
      user_id    : update.message.from.userId,
      user_name  : update.message.from.username,
      text       : update.message.text,
      is_msg     : true
    };
  } else if (update.callback_query) {
    Logger.log("handling callback");
    handleCallbackQuery(update.callback_query);
    return
  }

  Logger.log("user id = ", msgData.user_id)
  Logger.log("user name = ", msgData.user_name)

  if (msgData.chat_id == "" || msgData.chat_id == null || msgData.user_name == "" || msgData.user_name == null) {
    logRequest(msgData, "Empty user info")
    return
  }

  createNewUserIfNotExists(msgData.user_name, msgData.user_id, msgData.chat_id, msgData.name)


  if (msgData.text == "/menu") {
    sendKeyboard(msgData.chat_id);
    logRequest(msgData, "Menu");
    return
  }

  if (msgData.text == "/start") {
    answer = "Привет! Я Ваш помощник Chubby Bunny! 🐰\n\nС моей помощью Вы сможете отследить свои заказы, узнать об актуальных оплатах и найти ответы на часто задаваемые вопросы!\n\n" + 
    "Чтобы начать работу, воспользуйтесь \"Меню\"\n\nРад знакомству 🍀";
    answerArray.push(answer);
  }
  if (msgData.text == "/orders") {
    send("Пошёл на склад проверять заказы, скоро вернусь 🐰", msgData.chat_id)
    answerArray = getUserActualOrders(msgData.user_name)
  }
  if (msgData.text == "/payments") {
    send("Сейчас посчитаю 🐰", msgData.chat_id)
    answerArray = getCreditInfoString(msgData.user_name)
  }
  if (msgData.text == "/deliveries") {
    send("Сейчас посчитаю 🐰", msgData.chat_id)
    answerArray = getShippingOrdersForPayment(msgData.user_name)
  }
  if (msgData.text == "/atadmins") {
    send("Секундочку, уточняю у админа 🐰", msgData.chat_id)
    answerArray = getAtAdminsOrderInfo(msgData.user_name)
  }
  
  for (var i = 0; i < answerArray.length; i++) {
    send(answerArray[i], msgData.chat_id);
    logRequest(msgData, answerArray[i]);
  }
  sendKeyboard(msgData.chat_id)
}

function mainTest() {
  if (null !== "") {
    Logger.log("\"\" != \"\"")
  }
}

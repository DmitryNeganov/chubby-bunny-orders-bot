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

  Logger.log("user id = ", msgData.user_id)
  Logger.log("user name = ", msgData.user_name)

  createNewUserIfNotExists(msgData.user_name, msgData.user_id, msgData.chat_id, msgData.name)

  if (msgData.text == "/start") {
    answer = "Привет! Я Ваш помощник Chubby Bunny! 🐰\n\nС моей помощью Вы сможете отследить свои заказы, узнать об актуальных оплатах и найти ответы на часто задаваемые вопросы!\n\n" + 
    "Чтобы начать работу, воспользуйтесь кнопкой \"Меню\"\n\nРад знакомству 🍀";
  }
  if (msgData.text == "/orders") {
    send("Пошёл на склад проверять заказы, скоро вернусь 🐰", msgData.chat_id)
    answer = getUserActualOrders(msgData.user_name)
  }
  if (msgData.text == "/payments") {
    send("Сейчас посчитаю 🐰", msgData.chat_id)
    answer = getCreditInfoString(msgData.user_name)
  }
  if (msgData.text == "/deliveries") {
    send("Сейчас посчитаю 🐰", msgData.chat_id)
    answer = getShippingOrdersForPayment(msgData.user_name)
  }
  if (msgData.text == "/atadmins") {
    send("Секундочку, уточняю у админа 🐰", msgData.chat_id)
    answer = getAtAdminsOrderInfo(msgData.user_name)
  }
  send(answer, msgData.chat_id)
  logRequest(msgData, answer)
}

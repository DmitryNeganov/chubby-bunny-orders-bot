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

  if (msgData.text == "/start") {
    answer = "Привет! \nЯ могу показать Ваши актуальные заказы, для этого просто воспользуйтесь меню и выберите \"Мои заказы\"";

  }
  if (msgData.text == "/orders") {
    send("Пошёл на склад проверять заказы, скоро вернусь 🐰", msgData.chat_id)
    answer = getUserActualOrders(msgData.user_name)
  }
  send(answer, msgData.chat_id)
}

function test() {
  var tmp = getUserActualOrders("specialForDmitry");
  Logger.log = tmp;
}

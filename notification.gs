function notify(chatId, text) {
  var url = "https://api.telegram.org/bot6800297762:AAE94ZcWmA-CSvoPs-usHcyEHlDRNU8tU6w/sendMessage"
  var formData = {
    'chat_id' : chatId,
    'text': text
  };
  var options = {
    'payload' : formData
  };
  UrlFetchApp.fetch(url, options);
}

function updateNotification() {
  notificationText = "Привет! Скучали по мне? 🐰\n\n"
  // notificationText += "✨ Хочу познакомить вас со своим обновлением ✨ \n\n"
  notificationText += "Теперь вы можете запросить у меня список Вашего стаффа, который находится у админа в России!\n\n"
  notificationText += "Для этого нажмите \"Меню\" 🔜 \"Мои заказы у админа\"."

  var chatIds = getAllUsersChatId()

  for (var i = 0; i < chatIds.length; i++) {
    notify(chatIds[i], notificationText)
  }
}

function buyNotification1() {

  var notificationText = "Привет! Открыты новые закупки 🐰\n\n"
  notificationText += "• Стенд по манхве \"Сойти с дороги\":\n"
  notificationText += "https://t.me/chubby_bunny_comics/1170\n\n"
  notificationText += "• Мерч по манхве \"Синдром подавления\":\n"
  notificationText += "https://t.me/chubby_bunny_comics/1165"

    var chatIds = getAllUsersChatId()

  for (var i = 0; i < chatIds.length; i++) {
    notify(chatIds[i], notificationText)
  }

}

function testNotify() {
  notify("1238753976", "Привет! Одна отдыхаешь?")
}


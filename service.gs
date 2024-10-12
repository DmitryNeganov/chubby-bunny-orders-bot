function getUserActualOrders(username) {
  var resultString = "";
  var userOrders = getOrdersByUser(username);
  
  for (var i = 0; i < userOrders.length; i++) {
    var currentOrder = "Заказ #<b>" + userOrders[i].id + "</b>\n📍 Местоположение: <i>" + userOrders[i].place + "</i>\n Cтатус: " + userOrders[i].status
    if (userOrders[i].status == "Заказан") {
      currentOrder += getOrderReliseDate(userOrders[i])
    }
    if (userOrders[i].status == "Находится у админа") {
      currentOrder += " ✔️\n<b>Вы можете <a href=\"https://telegra.ph/Pravila-oformleniya-dostavki-otlozhki-razdachisamovyvoza-i-konsolidacii-04-29\">оформить доставку</a> 🚚 или написать @chubbybunnyadmin 🐰 о самовывозе</b>"
    } 
    currentOrder += "\n";
    resultString += currentOrder
    resultString += getOrderAllItems(userOrders[i].id) + "\n\n"
  }
  if (resultString == "") {
    resultString = "На данный момент у Вас нет активных заказов.\nЕсли Вы хотите сделать заказ, пожалуйста, напишите @chubbybunnyadmin 🐰"
  }
  return resultString;
}

function getOrderReliseDate(order) {
  var reliseDate
  if (order.reliseDate == "" || order.reliseDate == null) {
    reliseDate = "уточняется"
  } else {
    var date = new Date(order.reliseDate)
    var month = 1 + date.getMonth()
    reliseDate = date.getDate() + "." + month + "." + date.getFullYear()
  }
  return "\n Дата релиза: " + reliseDate
}

function getOrderAllItems(orderId) {
  var resultString = "";
  var orderItems = getItemsByOrderId(orderId)
  for (var i = 0; i < orderItems.length; i++) {
    var currentItem = "   📎 " + orderItems[i].name + " - " + orderItems[i].quantity + " шт.\n";
    resultString = resultString + currentItem;
  }
  return resultString;
}

function getCreditInfoString(username) {
  var resultString = "Неоплаченные заказы:\n\n"
  var counter = 0
  var userOrders = getOrdersByUser(username)
  if (userOrders.length == 0) {
    return "На данный момент у Вас нет активных заказов.\nЕсли Вы хотите сделать заказ, пожалуйста, напишите @chubbybunnyadmin 🐰"
  }
  for (i = 0; i < userOrders.length; i++) {
    if (userOrders[i].status == "Доставлен покупателю") {
      continue
    }
    var orderSum = 0;
    var orderItems = getItemsByOrderId(userOrders[i].id);
    for (j = 0; j < orderItems.length; j++) {
      orderSum += orderItems[j].price * orderItems[j].quantity
    }
    var rest = orderSum - userOrders[i].paymentSum 
    if (rest > 0) {
      resultString += "•Заказ #<b>" + userOrders[i].id + "</b>\n"
      resultString += rest + " руб."
      counter += rest
      if (userOrders[i].crediteDate != "") {
        if (userOrders[i].crediteDate < Date.now()) { 
          resultString += "❗️"
        }
        var month = 1 + userOrders[i].crediteDate.getMonth()
        var deadline = userOrders[i].crediteDate.getDate() + "." + month + "." + userOrders[i].crediteDate.getFullYear()
        resultString += " <i>оплатить до <b>" + deadline + "</b></i>\n\n"
      } else {
        resultString += "\n\n"
      }
    }
  }
  if (counter == 0) {
    resultString = "✔️ Все Ваши заказы оплачены"
  } else {
    resultString += "<b>Итого к оплате: " + counter + " руб.</b>\n\n"
    resultString += "Для оплаты заказов, пожалуйста, напишите: @chubbybunnyadmin"
  }
  return resultString
}

function getShippingOrdersForPayment(username) {
  var resultString = ""
  var shippingOrders = getShippingOrdersByUser(username)
  var ordersShipingSum = 0
  for (i = 0; i < shippingOrders.length; i++) {
    var orderId = shippingOrders[i].id
    var status = shippingOrders[i].status
    var currentOrderPaymentInfo = `Заказ #<b>${orderId}</b>\nСтатус: ${status}\n`
    var itemsInfoAndPrice = getOrderItemsShipmentPriceInfo(shippingOrders[i])
    currentOrderPaymentInfo += itemsInfoAndPrice.info
    resultString += currentOrderPaymentInfo + "\n\n" 
    ordersShipingSum += itemsInfoAndPrice.price - shippingOrders[i].deliveryToRussiaSum
  }
  if (shippingOrders.length == 0) {
    if (getUserAllOrders(username).length > 0) {
      return "На данный момент Вам не требуется оплачивать доставку. Оплата будет доступна после того, как заказ перейдет в статус \"Ожидает отправки\".\nПроверить статусы заказов Вы можете выбрав в меню \"Мои заказы\" или нажав /orders\nЕсли Вы хотите сделать новый заказ, пожалуйста, напишите @chubbybunnyadmin 🐰"
    } else {
      return "На данный момент у Вас нет активных заказов и оплат.\nЕсли Вы хотите сделать заказ, пожалуйста, напишите @chubbybunnyadmin 🐰"
    }
    
  }
  if (ordersShipingSum > 0) {
    resultString += "<b>Итого к оплате за доставку всех заказов " + ordersShipingSum + " руб.</b>\n\n"
    resultString += "Для оплаты доставки, пожалуйста, напишите: @chubbybunnyadmin"
  } else {
    resultString += "✔️ Вся Ваша доставка оплаченa. Спасибо! 🐰"
  }
  return resultString
}

function getPaymentAllert(status) {
  if (status == "Ожидает отправки") {
    return ""
  } else if (status == "В пути") {
    return "❕"
  } else if (status == "Прибыл в промежуточный пункт") {
    return "❗️"
  } else if (status == "Находится у админа") {
    return "❗️❗️❗️"
  }
}

class ItemsInfoAndPrice {
  constructor(info, price) {
  this.info = info
  this.price = price
  }
}

//todo: вынести сумму за все заказы
function getOrderItemsShipmentPriceInfo(order) {
  var resultString = "";
  var orderItems = getItemsByOrderId(order.id)
  var shipingSum = 0
  for (var i = 0; i < orderItems.length; i++) {
    shipingSum += orderItems[i].deliveryToRussiaCost * orderItems[i].quantity
    var currentItem = "   📎 " + orderItems[i].name + " - " + orderItems[i].quantity + " шт. Цена доставки - " + orderItems[i].deliveryToRussiaCost + " руб. за шт.\n";
    resultString = resultString + currentItem;
  }
  if (shipingSum > order.deliveryToRussiaSum){
    var allertIfNeeded = getPaymentAllert(order.status)
    resultString += `${allertIfNeeded}<b>Итого стоимость доставки до России: ${shipingSum} руб.</b>`
  } else {
    resultString += "✔️ Доставка оплачена"
  }

  return new ItemsInfoAndPrice(resultString, shipingSum)
}

function getAtAdminsOrderInfo(username) {
  var resultString = "";
  var userOrders = getAtAdminOrdersByUser(username)
  for (var i = 0; i < userOrders.length; i++) {
    var currentOrder = "Заказ #<b>" + userOrders[i].id + "</b>\n📍 Местоположение: <i>" + userOrders[i].place + "</i>\n"
    resultString += currentOrder
    resultString += getOrderAllItems(userOrders[i].id) + "\n\n"
  }
  resultString += "<b>Вы можете <a href=\"https://telegra.ph/Pravila-oformleniya-dostavki-otlozhki-razdachisamovyvoza-i-konsolidacii-04-29\">оформить доставку</a> 🚚 или написать @chubbybunnyadmin 🐰 о самовывозе</b>"
  if (userOrders.length == 0) {
    resultString = "На данный момент у Вас нет заказов, которые находятся у админа.\nЕсли Вы хотите сделать новый заказ, пожалуйста, напишите @chubbybunnyadmin 🐰"
  }
  return resultString;
}

//ЗАПУСК С КНОПКИ
function notifyUsersAboutMarkedOrders() {
  var orderToNotify = getOrdersToNotify()

  for (var i = 0; i < orderToNotify.length; i++) {
    var notificationText = getNotificationText(orderToNotify[i])
    var tgChatId = getUserChatId(orderToNotify[i].tgUsername)
    Logger.log(tgChatId + ": \n" + notificationText)
    // notify(tgChatId, notificationText)
  }
}

function getNotificationText(order) {
  var notificationText = "Статус Вашего заказа изменился 🐰 \n"
  notificationText += "Заказ #" + order.id + "\n📍 Местоположение: " + order.place + "\n Cтатус: " + order.status
  if (order.status == "Заказан") {
    currentOrder += getOrderReliseDate(order)
  }
  return notificationText
}

function testGetUserActualOrders() {
  Logger.log(getUserActualOrders("Pamparamparam"))
}

function testGetAtAdminsOrderInfo() {
  Logger.log(getAtAdminsOrderInfo("specialForDmitry"))
}

function testGetShippingOrdersForPayment() {
  Logger.log(getShippingOrdersForPayment("Pamparamparam"))
}

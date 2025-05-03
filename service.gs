function getUserActualOrders(username) {
  var result = new Array();
  var userOrders = getOrdersByUser(username);
  var batchSize = 10;
  var batchCounter = 0;
  var resultString = "";
  for (var i = 0; i < userOrders.length; i++) {
    resultString += getCurrentOrderString(userOrders[i])
    batchCounter++;
    if (batchCounter == batchSize) {
      result.push(resultString);
      Logger.log(resultString);
      resultString = "";
      batchCounter = 0;
    }
  }
  if (batchCounter > 0) {
    result.push(resultString);
    Logger.log(resultString);
  }
  if (result.length == 0) {
    result.push("На данный момент у Вас нет активных заказов.\nЕсли Вы хотите сделать заказ, пожалуйста, напишите @chubbybunnyadmin 🐰");
  }
  return result;
}

function getCurrentOrderString(order) {
  var resultString = "";
  var currentOrder = "Заказ #<b>" + order.id + "</b>\n📍 Местоположение: <i>" + order.place + "</i>\n Cтатус: " + order.status
    if (order.status == "Заказан") {
      currentOrder += getOrderReliseDate(order)
    }
    if (order.status == "Находится у админа") {
      currentOrder += " ✔️\n<b>Вы можете <a href=\"https://telegra.ph/Pravila-oformleniya-dostavki-otlozhki-razdachisamovyvoza-i-konsolidacii-04-29\">оформить доставку</a> 🚚 или написать @chubbybunnyadmin 🐰 о самовывозе</b>"
    }
    if (order.isPostponed) {
      currentOrder += getOrderPostponeDateFormated(order)
    }
    currentOrder += "\n";
    resultString += currentOrder
    resultString += getOrderAllItems(order.id) + "\n\n"
  return resultString;
}

function getOrderPostponeDateFormated(order) {
  if (order.postponedDate == "" || order.postponedDate == null) {
    reliseDate = " на неопределенный срок ⛔️" 
  } else {
    var date = new Date(order.postponedDate)
    var month = 1 + date.getMonth()
    return " до " + date.getDate() + "." + month + "." + date.getFullYear() + " ⏳"
  }
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
  var resultArray = new Array();

  var userOrders = getOrdersByUser(username)
  if (userOrders.length == 0) {
    resultArray.push("На данный момент у Вас нет активных заказов.\nЕсли Вы хотите сделать заказ, пожалуйста, напишите @chubbybunnyadmin 🐰");
    return resultArray
  }
  
  resultArray.push("Неоплаченные заказы:\n\n");
  var counter = 0;

  var batchSize = 10;
  var batchCounter = 0;
  var resultString = "";

  for (i = 0; i < userOrders.length; i++) {
    
    if (userOrders[i].status == "Доставлен покупателю") {
      continue;
    }
    var orderSum = 0;
    var orderItems = getItemsByOrderId(userOrders[i].id);
    for (j = 0; j < orderItems.length; j++) {
      orderSum += orderItems[j].price * orderItems[j].quantity
    }
    var rest = orderSum - userOrders[i].paymentSum 
    if (rest > 0) {
      batchCounter++;
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
    if (batchCounter == batchSize) {
      resultArray.push(resultString);
      Logger.log(resultString);
      resultString = "";
      batchCounter = 0;
    }
  }

  if (batchCounter) {
    resultArray.push(resultString);
    Logger.log(resultString);
  }

  if (counter == 0) {
      resultArray.push("✔️ Все Ваши заказы оплачены")
      Logger.log("✔️ Все Ваши заказы оплачены");
    } else {
      resultArray.push("<b>Итого к оплате: " + counter + " руб.</b>\n\n")
      resultArray.push("Для оплаты заказов, пожалуйста, напишите: @chubbybunnyadmin")
      Logger.log("<b>Итого к оплате: " + counter + " руб.</b>\n\n")
      Logger.log("Для оплаты заказов, пожалуйста, напишите: @chubbybunnyadmin")
  }
  
  return resultArray;
}

function getShippingOrdersForPayment(username) {
  var resultArray = new Array();
  var shippingOrders = getShippingOrdersByUser(username)
  var ordersShipingSum = 0

  var batchSize = 5;
  var batchCounter = 0;
  var resultString = ""

  for (i = 0; i < shippingOrders.length; i++) {
    var orderId = shippingOrders[i].id
    var status = shippingOrders[i].status
    var currentOrderPaymentInfo = `Заказ #<b>${orderId}</b>\nСтатус: ${status}\n`
    var itemsInfoAndPrice = getOrderItemsShipmentPriceInfo(shippingOrders[i])
    currentOrderPaymentInfo += itemsInfoAndPrice.info
    resultString += currentOrderPaymentInfo + "\n\n" 
    ordersShipingSum += itemsInfoAndPrice.price - shippingOrders[i].deliveryToRussiaSum

    batchCounter++;
    if (batchCounter == batchSize) {
      resultArray.push(resultString);
      Logger.log(resultString);
      resultString = "";
      batchCounter = 0;
    }
  }

  if (batchCounter) {
    resultArray.push(resultString);
    Logger.log(resultString);
  }
  
  if (shippingOrders.length == 0) {
    if (getUserAllOrders(username).length > 0) {
      resultArray.push("На данный момент Вам не требуется оплачивать доставку. Оплата будет доступна после того, как заказ перейдет в статус \"Ожидает отправки\".\nПроверить статусы заказов Вы можете выбрав в меню \"Мои заказы\" или нажав /orders\nЕсли Вы хотите сделать новый заказ, пожалуйста, напишите @chubbybunnyadmin 🐰");
    } else {
      resultArray.push("На данный момент у Вас нет активных заказов и оплат.\nЕсли Вы хотите сделать заказ, пожалуйста, напишите @chubbybunnyadmin 🐰");
    }
    
  }
  if (ordersShipingSum > 0) {
    resultArray.push("<b>Итого к оплате за доставку всех заказов " + ordersShipingSum + " руб.</b>\n\n")
    resultArray.push("Для оплаты доставки, пожалуйста, напишите: @chubbybunnyadmin")
    Logger.log("<b>Итого к оплате за доставку всех заказов " + ordersShipingSum + " руб.</b>\n\n");
    Logger.log("Для оплаты доставки, пожалуйста, напишите: @chubbybunnyadmin");
  } else {
    resultArray.push("✔️ Вся Ваша доставка оплаченa. Спасибо! 🐰")
    Logger.log("✔️ Вся Ваша доставка оплаченa. Спасибо! 🐰");
  }
  return resultArray
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
  var resultArray = new Array();  
  var batchSize = 5;
  var batchCounter = 0;
  var resultString = "";
  var userOrders = getAtAdminOrdersByUser(username);

  for (var i = 0; i < userOrders.length; i++) {
    var currentOrder = "Заказ #<b>" + userOrders[i].id + "</b>\n📍 Местоположение: <i>" + userOrders[i].place + "</i>\n";
    resultString += currentOrder;
    resultString += getOrderAllItems(userOrders[i].id) + "\n\n";

    batchCounter++;
    if (batchCounter == batchSize) {
      resultArray.push(resultString);
      Logger.log(resultString);
      resultString = "";
      batchCounter = 0;
    }
  }

  if (batchCounter) {
    resultArray.push(resultString);
    Logger.log(resultString);
  }

  if (userOrders.length == 0) {
    resultArray.push("На данный момент у Вас нет заказов, которые находятся у админа.\nЕсли Вы хотите сделать новый заказ, пожалуйста, напишите @chubbybunnyadmin 🐰");
  } else {
    resultArray.push("<b>Вы можете <a href=\"https://telegra.ph/Pravila-oformleniya-dostavki-otlozhki-razdachisamovyvoza-i-konsolidacii-04-29\">оформить доставку</a> 🚚 или написать @chubbybunnyadmin 🐰 о самовывозе</b>");
  }

  return resultArray;
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
  getUserActualOrders("your_itami")
  // getUserActualOrders("specialForDmitry")
}

function testGetCreditInfoString() {
  Logger.log(getCreditInfoString("your_itami"))
  // getCreditInfoString("specialForDmitry")
}

function testGetAtAdminsOrderInfo() {
  Logger.log(getAtAdminsOrderInfo("specialForDmitry"))
}

function testGetShippingOrdersForPayment() {
  // getShippingOrdersForPayment("specialForDmitry")
  getShippingOrdersForPayment("nnnthniel")
}

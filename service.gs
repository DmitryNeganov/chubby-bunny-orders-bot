function getUserActualOrders(username) {
  var resultString = "";
  var userOrders = getOrdersByUser(username)
  for (var i = 0; i < userOrders.length; i++) {
    var currentOrder = "Заказ #<b>" + userOrders[i].id + "</b>\n📍 Местоположение: <i>" + userOrders[i].place + "</i>\n Cтатус: " + userOrders[i].status
    if (userOrders[i].status == "Заказан") {
      currentOrder += getOrderReliseDate(userOrders[i])
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
      resultString += "<i>оплатить до <b>" + deadline + "</b></i>\n\n"
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
    ordersShipingSum += itemsInfoAndPrice.price
  }
  if (shippingOrders.length == 0) {
    return "На данный момент у Вас нет активных заказов.\nЕсли Вы хотите сделать заказ, пожалуйста, напишите @chubbybunnyadmin 🐰"
  }
  if (ordersShipingSum != 0) {
    resultString += "<b>Итого к оплате за доставку всех заказов " + ordersShipingSum + " руб.</b>\n\n"
    resultString += "Для оплаты доставки, пожалуйста, напишите: @chubbybunnyadmin"
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
    resultString += `${allertIfNeeded}<b>Итого к оплате за доставку: ${shipingSum} руб.</b>`
  } else {
    resultString += "✔️ Доставка оплачена"
  }

  return new ItemsInfoAndPrice(resultString, shipingSum)
}



function testGetUserActualOrders() {
  Logger.log(getUserActualOrders("specialForDmitry"))
}

function testGetCreditInfoString() {
  Logger.log(getCreditInfoString("specialForDmitry"))
}

function testGetShippingOrdersForPayment() {
  Logger.log(getShippingOrdersForPayment("specialForDmitry"))
}

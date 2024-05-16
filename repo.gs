const doc = SpreadsheetApp.getActive();
const usersSheet = doc.getSheetByName("users");
const ordersSheet = doc.getSheetByName("orders");
const itemsSheet = doc.getSheetByName("items");

class User {
  constructor(id, tgUsername, name) {
    this.id = id;
    this.tgUsername = tgUsername;
    this.name = name;
  }
}

class Order {
  constructor(id, username, place, status, reliseDate, crediteDate, paymentSum) {
    this.id = id
    this.username = username
    this.place = place
    this.status = status
    this.reliseDate = reliseDate
    this.crediteDate = crediteDate
    this.paymentSum = paymentSum
  }
}

class Item {
  constructor(id, orderId, name, quantity, price) {
    this.id = id
    this.orderId = orderId
    this.name = name
    this.quantity = quantity
    this.price = price
  }
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

function getUserActualOrders(username) {
  var resultString = "";
  Logger.log("Ваши заказы: ");
  var data = ordersSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] == username  && data[i][3] != "Доставлен покупателю") {
      var currentOrder = "Заказ #<b>" + data[i][0] + "</b>\n📍 Местоположение: <i>" + data[i][2] + "</i>\n Cтатус: " + getOrderStatusInfo(i) + "\n";
      Logger.log(currentOrder);
      resultString = resultString + currentOrder;
      resultString = resultString + getOrderAllItems(data[i][0]) + "\n\n";
    }
  }
  if (resultString == "") {
    resultString = "На данный момент у Вас нет активных заказов.\nЕсли Вы хотите сделать заказ, пожалуйста, напишите @chubbybunnyadmin 🐰"
  }
  return resultString;
}

function getOrderStatusInfo(rowNumber) {
  var data = ordersSheet.getDataRange().getValues();
  if (data[rowNumber][3] == "Заказан") {
    var reliseDate
    if (data[rowNumber][4] == "" || data[rowNumber][4] == null) {
      reliseDate = "уточняется"
    } else {
      var date = new Date(data[rowNumber][4])
      var month = 1 + date.getMonth()
      reliseDate = date.getDate() + "." + month + "." + date.getFullYear()
    }
    return data[rowNumber][3] + "\n Дата релиза: " + reliseDate
  } else {
    return data[rowNumber][3]
  }
}

function getOrderAllItems(orderId) {
  var resultString = "";
  var data = itemsSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] == orderId) {
      var currentItem = "   📎 " + data[i][2] + " - " + data[i][3] + " шт.\n";
      Logger.log(currentItem);
      resultString = resultString + currentItem;
    }
  }
  return resultString;
}



function getOrdersByUser(username) {
  var data = ordersSheet.getDataRange().getValues();
  var ordes = new Array();
  for (var row = 0; row < data.length; row++) {
    if (data[row][1] == username && data[row][3] != "Доставлен покупателю") {
      var payedSum 
      if (data[row][6] == "") {
        payedSum = 0
      } else {
        payedSum = parseInt(data[row][6])
      }
      var order = new Order(data[row][0], data[row][1], data[row][2], data[row][3], data[row][4], data[row][5], payedSum)
      ordes.push(order);
    }
  }
  return ordes;
}

function getItemsByOrderId(orderId) {
  var data = itemsSheet.getDataRange().getValues();
  var items = new Array();
  for (var row = 0; row < data.length; row++) {
    if (data[row][1] == orderId) {
      var item = new Item(data[row][0], data[row][1], data[row][2], data[row][3], data[row][6])
      items.push(item);
    }
  }
  return items;
}

function getPaymentsInfoString(username) {
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

function testRepo() {
  Logger.log(getPaymentsInfoString("specialForDmitry"))

  // Logger.log(parseInt("123"))

  // var payment = getPaymentByOrderId(3001)
  // Logger.log(payment);

  // var ids = getOrdersByUser("yakushchenko")
  // ids.forEach(v => Logger.log(v));

}

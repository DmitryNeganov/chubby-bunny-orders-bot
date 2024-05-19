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
  constructor(id, username, place, status, reliseDate, crediteDate, paymentSum, deliveryToRussiaSum) {
    this.id = id
    this.username = username
    this.place = place
    this.status = status
    this.reliseDate = reliseDate
    this.crediteDate = crediteDate
    this.paymentSum = paymentSum
    this.deliveryToRussiaSum = deliveryToRussiaSum
  }
}

class Item {
  constructor(id, orderId, name, quantity, price, deliveryToRussiaCost) {
    this.id = id
    this.orderId = orderId
    this.name = name
    this.quantity = quantity
    this.price = price
    this.deliveryToRussiaCost = deliveryToRussiaCost
  }
}

function getOrdersByUser(username) {
  var data = ordersSheet.getDataRange().getValues();
  var ordes = new Array();
  for (var row = 0; row < data.length; row++) {
    if (data[row][1] == username && data[row][3] != "Доставлен покупателю") {
      var order = new Order(data[row][0], data[row][1], data[row][2], data[row][3], data[row][4], data[row][5], data[row][6], data[row][7])
      ordes.push(order);
    }
  }
  return ordes;
}

function getShippingOrdersByUser(username) {
  var data = ordersSheet.getDataRange().getValues();
  var ordes = new Array();
  for (var row = 0; row < data.length; row++) {
    if (data[row][1] == username && 
          (data[row][3] == "Ожидает отправки" || data[row][3] == "В пути" || data[row][3] == "Прибыл в промежуточный пункт" || data[row][3] == "Находится у админа") 
      ) {
      var order = new Order(data[row][0], data[row][1], data[row][2], data[row][3], data[row][4], data[row][5], data[row][6], data[row][7])
      ordes.push(order);
    }
  }
  return ordes;
}

function getUserAllOrders(username) {
  var data = ordersSheet.getDataRange().getValues();
  var ordes = new Array();
  for (var row = 0; row < data.length; row++) {
    if (data[row][1] == username) {
      var order = new Order(data[row][0], data[row][1], data[row][2], data[row][3], data[row][4], data[row][5], data[row][6], data[row][7])
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
      var deliveryToRussiaCost = parseNumberFromCell(data[row][6])
      var item = new Item(data[row][0], data[row][1], data[row][2], data[row][3], data[row][5], deliveryToRussiaCost)
      items.push(item);
    }
  }
  return items;
}

function parseNumberFromCell(dataInCell) {
  var number 
  if (dataInCell == "") {
    number = 0
  } else {
    number = parseInt(dataInCell)
  }
  return number
}

function testRepo() {
  Logger.log(getPaymentsInfoString("specialForDmitry"))
  // Logger.log(getUserActualOrders("specialForDmitry"))
  Logger.log(parseInt("123"))


  // var payment = getPaymentByOrderId(3001)
  // Logger.log(payment);

  // var ids = getOrdersByUser("yakushchenko")
  // ids.forEach(v => Logger.log(v));

}

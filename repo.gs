const doc = SpreadsheetApp.getActive();
const usersSheet = doc.getSheetByName("users");
const ordersSheet = doc.getSheetByName("orders");
const itemsSheet = doc.getSheetByName("items");

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
    resultString = "На данный момент у Вас нет активных заказов.\nЕсли Вы хотите сделать заказ, пожалуйста, напишите @chubbybunnyadmin"
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

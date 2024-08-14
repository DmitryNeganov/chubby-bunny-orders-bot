const usersSheet = doc.getSheetByName("users");

function getUsersData() {
  return usersSheet.getDataRange().getValues()
}

class User {
  constructor(id, tgUsername, tgUserId, tgChatId, name, messageAllowed) {
    this.id = id;
    this.tgUsername = tgUsername;
    this.tgUserId = tgUserId;
    this.tgChatId = tgChatId;
    this.name = name;
    this.messageAllowed = messageAllowed;
  }
}

function getAllUsersChatId() {
  var data = getUsersData()
  var usersChatIds = new Array();

  for (var row = 2; row < data.length; row++) {
    var chatId = data[row][3].toString()
    if (chatId != "") {
      usersChatIds.push(chatId)
    }
  }

  return usersChatIds
}

function saveUser(tgUsername, tgUserId, tgChatId, name, messageAllowed) {
  var data = getUsersData()
  var newId = data.length + 1
  usersSheet.appendRow([newId, tgUsername, tgUserId, tgChatId, name, messageAllowed])
  var user = new User(newId, tgUsername, tgUserId, tgChatId, name, messageAllowed)
  return user
}

function getUserByTgUsername(tgUsername) {
  var data = getUsersData()
  for (var row = 2; row < data.length; row++) {
    if (data[row][1] == tgUsername) {
      return new User(data[row][0], data[row][1], data[row][2], data[row][3], data[row][4], data[row][5])
    }
  }
  return null
}

function setMessageAllowed(user) {
  var row = user.id
  usersSheet.getRange(row, 6).setValue(true)
}

function createNewUserIfNotExists(tgUsername, tgUserId, tgChatId, name) {
  var user = getUserByTgUsername(tgUsername)
  if (user == null) {
    saveUser(tgUsername, tgUserId, tgChatId, name, true)
  }
}

function test() {
  saveUser("specialfordmitry", 123, 456, "Dmitry", true)
  var res = getUserByTgUsername("specialfordmitry")
  Logger.log(res)
  // Logger.log(getUserByTgUsername("specialfordmitry"))s
  // setMessageAllowed(getUserByTgUsername("specialfordmitry"))
}

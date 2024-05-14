const App_link = "https://script.google.com/macros/s/AKfycbyum24N2BEj0Q1yNM0HEWSoDmMwFEtRczvF-t21poLo83R5zpnbcQAI_zGvhTcju95shw/exec";
//после каждого деплоя обновляем значение переменной

const token = "6319707052:AAHi9Rx4w6fMnbxyHKZ_ymtK0oXKv7v8Ovw";

function api_connector () {
  UrlFetchApp.fetch("https://api.telegram.org/bot"+token+"/setWebHook?url="+App_link); 
}

function send(msg, chat_id) {
  const payload = {
    'method': 'sendMessage',
    'chat_id': String(chat_id),
    'text': msg,
    'parse_mode': 'HTML'
    
  }
  const data = {
    'method': 'post',
    'payload': payload,
    'muteHttpExceptions': true
  }
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

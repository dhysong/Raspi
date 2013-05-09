var charLCD = require('CharLCD');
console.log(charLCD);

var lcd = charLCD.Setup();
console.log(lcd);
lcd.Begin(16,1);
lcd.Clear();
lcd.Message('Hello World');
lcd.Message('Hello Drew');


var charLCD = require('CharLCD');

var lcd = charLCD.Setup(pinReadyCallback);

function pinReadyCallback(){
	lcd.Begin(16,1);
	lcd.Clear();
	lcd.Message('Hello World');
	lcd.Message('Hello Drew');
}


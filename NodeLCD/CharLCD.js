/*
* based on code from Adafruit
* https://github.com/adafruit/Adafruit-Raspberry-Pi-Python-Code/blob/master/Adafruit_CharLCD/Adafruit_CharLCD.py
*
* which was based on code from lrvick and LiquidCrystal
* lrvic - https://github.com/lrvick/raspi-hd44780/blob/master/hd44780.py
* LiquidCrystal - https://github.com/arduino/Arduino/blob/master/libraries/LiquidCrystal/LiquidCrystal.cpp
*/

/*
var sleep = require('sleep');
var GPIO = require("gpio");
*/

function CharLCD(pin_rs, pin_e, pins_db){
    pin_rs = typeof pin_rs !== 'undefined' ? pin_rs : 25;
    pin_e = typeof pin_e !== 'undefined' ? pin_e : 24;
    pins_db = typeof pins_db !== 'undefined' ? pins_db : [23, 17, 21, 22];
	
	// commands
    var LCD_CLEARDISPLAY = 0x01;
    var LCD_RETURNHOME = 0x02;
    var LCD_ENTRYMODESET = 0x04;
    var LCD_DISPLAYCONTROL = 0x08;
    var LCD_CURSORSHIFT = 0x10;
    var LCD_FUNCTIONSET = 0x20;
    var LCD_SETCGRAMADDR = 0x40;
    var LCD_SETDDRAMADDR = 0x80;
	
	write4bits(0x01); 
	write4bits(0x02); 
	write4bits(0x04); 
	write4bits(0x08); 
	write4bits(0x10); 
	write4bits(0x20); 
	write4bits(0x40); 
	write4bits(0x80); 
     
    // flags for display entry mode
    var LCD_ENTRYRIGHT = 0x00;
    var LCD_ENTRYLEFT = 0x02;
    var LCD_ENTRYSHIFTINCREMENT = 0x01;
    var LCD_ENTRYSHIFTDECREMENT = 0x00;
     
    // flags for display on/off control
    var LCD_DISPLAYON = 0x04;
    var LCD_DISPLAYOFF = 0x00;
    var LCD_CURSORON = 0x02;
    var LCD_CURSOROFF = 0x00;
    var LCD_BLINKON = 0x01;
    var LCD_BLINKOFF = 0x00;
   
    // flags for display/cursor shift
    var LCD_DISPLAYMOVE = 0x08;
    var LCD_CURSORMOVE = 0x00;
	
    // flags for display/cursor shift
    var LCD_DISPLAYMOVE = 0x08;
    var LCD_CURSORMOVE = 0x00;
    var LCD_MOVERIGHT = 0x04;
    var LCD_MOVELEFT = 0x00;
	
    // flags for function set
    var LCD_8BITMODE = 0x10;
    var LCD_4BITMODE = 0x00;
    var LCD_2LINE = 0x08;
    var LCD_1LINE = 0x00;
    var LCD_5x10DOTS = 0x04;
    var LCD_5x8DOTS = 0x00;
		
	/*
	var gpio24 = GPIO.export(pin_e, {
		direction: 'out',
		interval: 200,
		ready: function(){
		
		}
	});	
	
	var gpio25 = GPIO.export(pin_rs, {
		direction: 'out',
		interval: 200,
		ready: function(){
		
		}
	});
	
	for(i=0; i < pins_db.length; i++){
		GPIO.export(pins_db[i], {
			direction: 'out',
			interval: 200,
			ready: function(){
			
			}
		});
	}
	*/

	write4bits(0x33); // initialization
	write4bits(0x32); // initialization
	write4bits(0x28); // 2 line 5x7 matrix
	write4bits(0x0C); // turn cursor off 0x0E to enable cursor
	write4bits(0x06); // shift cursor right

	displaycontrol = LCD_DISPLAYON | LCD_CURSOROFF | LCD_BLINKOFF;

	displayfunction = LCD_4BITMODE | LCD_1LINE | LCD_5x8DOTS;
	displayfunction |= LCD_2LINE;

	//""" Initialize to default text direction (for romance languages) """
	var displaymode =  LCD_ENTRYLEFT | LCD_ENTRYSHIFTDECREMENT;
	write4bits(LCD_ENTRYMODESET | displaymode); //  set the entry mode

    clear();
	
	function begin(cols, lines){
		if(lines > 1){
			numlines = lines;
			displayfunction |= LCD_2LINE;
			curline = 0;
		}
	}
	
	function home(){
		write4bits(LCD_RETURNHOME); // set cursor position to zero
		delayMicroseconds(3000); // this command takes a long time!
	}
	
	function clear(){
		write4bits(LCD_CLEARDISPLAY); // command to clear display
		delayMicroseconds(3000);	// 3000 microsecond sleep, clearing the display takes a long time
	}
	
	function setCursor(col, row){
		var row_offsets = [ 0x00, 0x40, 0x14, 0x54 ];

		if ( row > numlines )
			row = numlines - 1; // we count rows starting w/0

		write4bits(LCD_SETDDRAMADDR | (col + row_offsets[row]));
	}
	
	function noDisplay(){
		displaycontrol = LCD_DISPLAYON;
		write4bits(LCD_DISPLAYCONTROL | displaycontrol);
	}
	
	function display(){
		displaycontrol |= LCD_DISPLAYON;
		write4bits(LCD_DISPLAYCONTROL | displaycontrol);
	}
	
	function noCursor(){
		displaycontrol &= LCD_CURSORON;
		write4bits(LCD_DISPLAYCONTROL | displaycontrol);
	}
	
	function cursor(){
		displaycontrol |= LCD_CURSORON;
		write4bits(LCD_DISPLAYCONTROL | displaycontrol);
	}
	
	function noBlink(){
		displaycontrol &= ~LCD_BLINKON;
		write4bits(LCD_DISPLAYCONTROL | displaycontrol);
	}
	
	function DisplayLeft(){
		write4bits(LCD_CURSORSHIFT | LCD_DISPLAYMOVE | LCD_MOVELEFT);
	}
	
	function scrollDisplayRight(){
		write4bits(LCD_CURSORSHIFT | LCD_DISPLAYMOVE | LCD_MOVERIGHT);
	}
	
	function leftToRight(){
		displaymode |= LCD_ENTRYLEFT;
		write4bits(LCD_ENTRYMODESET | displaymode);
	}
	
	function rightToLeft(){
		displaymode &= ~LCD_ENTRYLEFT;
		write4bits(LCD_ENTRYMODESET | displaymode);
	}
	
	function autoscroll(){
		displaymode |= LCD_ENTRYSHIFTINCREMENT;
		write4bits(LCD_ENTRYMODESET | displaymode);
	}
	
	function noAutoscroll(){
		displaymode &= ~LCD_ENTRYSHIFTINCREMENT;
		write4bits(LCD_ENTRYMODESET | displaymode);
	}
		
	function write4bits(bits, char_mode){
	    if(typeof char_mode == 'undefined') char_mode = false;
		delayMicroseconds(1000); // 1000 microsecond sleep
		
		//I'm not sure about this... need to test the equivalent code in python
		console.log(zeroFill(bits.toString(2), 8));
		bits = zeroFill(bits.toString(2).substring(2, bits.toString().length - 2), 8);
		//console.log(bits);
	};	
	
	function delayMicroseconds(ms){
		//sleep.usleep(ms);
	};
	
	function pulseEnable(){
	
		delayMicroseconds(1);
	
		delayMicroseconds(1);
	
		delayMicroseconds(1);
	};
	
	function message(text){
		for(i = 0; i < text.length; i++){
			if(text[0] === '\n'){
				write4bits(0xC0); // next line
			}
			else{
				write4bits(ord(char),true)
			}
		}
	};
	
	function zeroFill(num, places) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join("0") + num;
	};
	
	function ord (string) {
	  // http://kevin.vanzonneveld.net
	  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: Onno Marsman
	  // +   improved by: Brett Zamir (http://brett-zamir.me)
	  // +   input by: incidence
	  // *     example 1: ord('K');
	  // *     returns 1: 75
	  // *     example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
	  // *     returns 2: 65536
	  var str = string + '',
		code = str.charCodeAt(0);
	  if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
		var hi = code;
		if (str.length === 1) {
		  return code; // This is just a high surrogate with no following low surrogate, so we return its value;
		  // we could also throw an error as it is not a complete character, but someone may want to know
		}
		var low = str.charCodeAt(1);
		return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
	  }
	  if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
		return code; // This is just a low surrogate with no preceding high surrogate, so we return its value;
		// we could also throw an error as it is not a complete character, but someone may want to know
	  }
	  return code;
	}
};

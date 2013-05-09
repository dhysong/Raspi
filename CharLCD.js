var sleep = require('sleep');
var GPIO = require("gpio");

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

	write4bits(0x33); // initialization
	write4bits(0x32); // initialization
	write4bits(0x28); // 2 line 5x7 matrix
	write4bits(0x0C); // turn cursor off 0x0E to enable cursor
	write4bits(0x06); // shift cursor right

	displaycontrol = LCD_DISPLAYON | LCD_CURSOROFF | LCD_BLINKOFF;

	displayfunction = LCD_4BITMODE | LCD_1LINE | LCD_5x8DOTS;
	displayfunction |= LCD_2LINE;

	//""" Initialize to default text direction (for romance languages) """
	displaymode =  LCD_ENTRYLEFT | LCD_ENTRYSHIFTDECREMENT;
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
		
	function write4bits(bits){
		delayMicroseconds(1000); // 1000 microsecond sleep
		bits = bits.toString(2);
		console.log(bits);
	};	
};

CharLCD.prototype = function(){
	return {};
}();


write4bits(0x33) # initialization
write4bits(0x32) # initialization
write4bits(0x28) # 2 line 5x7 matrix
write4bits(0x0C) # turn cursor off 0x0E to enable cursor
write4bits(0x06) # shift cursor right


def write4bits(self, bits, char_mode=False):
	bits=bin(bits)[2:].zfill(8)
	print bits
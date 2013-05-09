#!/usr/bin/python

def write4bits(self, bits, char_mode=False):
	bits=bin(bits)[2:].zfill(8)
	print bits

write4bits(0x33) 
write4bits(0x32) 
write4bits(0x28) 
write4bits(0x0C) 
write4bits(0x06) 


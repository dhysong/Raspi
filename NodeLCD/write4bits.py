#!/usr/bin/python

def write4bits(bits):
	bits=bin(bits)[2:].zfill(8)
	print bits
	
	
write4bits(0x01) 
write4bits(0x02) 
write4bits(0x04) 
write4bits(0x08) 
write4bits(0x10) 
write4bits(0x20) 
write4bits(0x40) 
write4bits(0x80) 

temp = list(range(4))
print temp[::-1] 


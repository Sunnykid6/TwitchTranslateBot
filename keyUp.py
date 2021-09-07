import time
from pynput.keyboard import Key, Controller

def press(timestopress):
	keyboard = Controller()
	i = 0
	timestopress = int(timestopress)
	for i in range(0, timestopress):
		keyboard.press(Key.up)
		time.sleep(0.1)
		keyboard.release(Key.up)
		time.sleep(0.2)

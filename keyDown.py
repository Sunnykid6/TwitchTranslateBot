import time
from pynput.keyboard import Key, Controller

def press(timestopress1):
	keyboard = Controller()
	i = 0
	timestopress1 = int(timestopress1)
	for i in range(0, timestopress1):
		keyboard.press(Key.down)
		time.sleep(0.1)
		keyboard.release(Key.down)
		time.sleep(0.2)
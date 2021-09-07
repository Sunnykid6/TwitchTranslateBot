import time
from pynput.keyboard import Key, Controller

def press(timestopress2):
	keyboard = Controller()
	i = 0
	timestopress2 = int(timestopress2)
	for i in range(0, timestopress2):
		keyboard.press(Key.left)
		time.sleep(0.1)
		keyboard.release(Key.left)
		time.sleep(0.2)
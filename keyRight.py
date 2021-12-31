import time
from pynput.keyboard import Key, Controller

def press(timestopress3):
	keyboard = Controller()
	i = 0
	timestopress3 = int(timestopress3)
	for i in range(0, timestopress3):
		keyboard.press(Key.right)
		time.sleep(0.1)
		keyboard.release(Key.right)
		time.sleep(0.2)
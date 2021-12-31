import time
from pynput.keyboard import Key, Controller

def press(timestopress5):
	keyboard = Controller()
	i = 0
	timestopress5 = int(timestopress5)
	for i in range(0, timestopress5):
		keyboard.press('x')
		time.sleep(0.1)
		keyboard.release('x')
		time.sleep(0.2)
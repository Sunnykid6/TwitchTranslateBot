import time
from pynput.keyboard import Key, Controller

def press(timestopress7):
	keyboard = Controller()
	i = 0
	timestopress7 = int(timestopress7)
	for i in range(0, timestopress7):
		keyboard.press('k')
		time.sleep(0.1)
		keyboard.release('k')
		time.sleep(0.2)
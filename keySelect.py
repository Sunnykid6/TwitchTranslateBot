import time
from pynput.keyboard import Key, Controller

def press(timestopress6):
	keyboard = Controller()
	i = 0
	timestopress6 = int(timestopress6)
	for i in range(0, timestopress6):
		keyboard.press('j');
		time.sleep(0.1)
		keyboard.release('j')
		time.sleep(0.2)
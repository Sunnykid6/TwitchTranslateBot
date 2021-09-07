import time
from pynput.keyboard import Key, Controller

def press(timestopress4):
	keyboard = Controller()
	i = 0
	timestopress4 = int(timestopress4)
	for i in range(0, timestopress4):
		keyboard.press('z')
		time.sleep(0.1)
		keyboard.release('z')
		time.sleep(0.2)
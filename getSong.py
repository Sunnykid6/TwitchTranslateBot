import win32gui
import win32api
import codecs

windows = []
mywindows = []  
def enumerationCallaback(hwnd, results):
    text = win32gui.GetWindowText(hwnd)
    if text.find("Mozilla Firefox") >= 0:
        results.append((hwnd, text))

def getinfo():
	original = win32gui.FindWindow("SpotifyMainWindow", None)
	iterations = win32gui.GetWindowText(original)

	def find_spotify_uwp(hwnd, windows):
	    text = win32gui.GetWindowText(hwnd)
	    classname = win32gui.GetClassName(hwnd)
	    if classname == "Chrome_WidgetWin_0" and len(text) > 0:
	        windows.append(text)

	if iterations:
	    windows.append(iterations)
	else:
	    win32gui.EnumWindows(find_spotify_uwp, windows)

	# If Spotify isn't running the list will be empty
	if len(windows) == 0:
		outputfile = open('SpotifyInfo.txt', "w")
		outputfile.write("Spotify is closed")
		outputfile.close()
		win32gui.EnumWindows(enumerationCallaback, mywindows)
		outputfiles = codecs.open('youtubeInfo.txt', "w", "utf-8")
		for win, text in mywindows:
			outputfiles.write(text.replace('- YouTube — Mozilla Firefox', ''))
		outputfiles.close()
		return 

	if windows[0].startswith('Spotify'):
	    print("Spotify is paused")
	    return
	# Local songs may only have a title field
	try:
	    artist, track = windows[0].split(" - ", 1)
	except ValueError:
	    artist = ''
	    track = windows[0]


	#if geturl(artist,track) == -1:
	#	return

	#query = track + " " + artist  + " lyric video youtube"
	#for j in search(query, tld="co.in", num=10, stop=10, pause=2):
	#	url = j	
	outputfile = open('SpotifyInfo.txt', "w")
	outputfile.write(track + " by " + artist + '\n')
	outputfile.close()
	
	return artist, track

def geturl(artist, track):
	check = 0
	with open("SpotifyInfo.txt") as myfile:
		if artist and track in myfile.read():
			check = 1
	if check == 1:
		return -1
	return 1


getinfo()

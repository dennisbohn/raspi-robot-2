from buildhat import Motor
import re
import sys

motor = {
    'A': Motor('A'),
    'B': Motor('B')
}
pattern = re.compile("^[AB]\d+$")

for line in sys.stdin:
    stdin = line.strip().upper()
    if (re.match(pattern, stdin)):
        wheel = stdin[0:1]
        speed = int(stdin[1:])
        if speed > 0 and speed <= 100:
            print("Start motor")
            motor[wheel].start(speed)
        else:
            print("Stop motor")
            motor[wheel].stop()

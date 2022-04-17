from buildhat import MotorPair
import re
import sys
import logging

pair = MotorPair('A', 'B')

pair.stop()

motor = {
    'A': 0,
    'B': 0
}
pattern = re.compile("^[AB]\-?\d+$")

for line in sys.stdin:
    splits = line.strip().upper().split()
    for split in splits:
        if (re.match(pattern, split)):
            wheel = split[0:1]
            speed = int(split[1:])
            motor[wheel] = speed
    if motor["A"] == 0 and motor["B"] == 0:
        print("stop")
        pair.start(0, 0)
        pair.stop()
    else:
        print(line.strip())
        pair.start(motor["A"], motor["B"] * -1)
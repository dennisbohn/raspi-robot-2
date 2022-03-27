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

print("start")
for line in sys.stdin:
    print(line.strip())
    splits = line.strip().upper().split()
    for split in splits:
        if (re.match(pattern, split)):
            wheel = split[0:1]
            speed = int(split[1:])
            motor[wheel] = speed
    pair.start(motor["A"], motor["B"] * -1)
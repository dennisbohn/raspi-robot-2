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
    if (line.strip().upper() == "STOP"):
        pair.stop()
        print("FULL STOP")
    else:
        splits = line.strip().upper().split()
        for split in splits:
            if (re.match(pattern, split)):
                wheel = split[0:1]
                speed = int(split[1:])
                motor[wheel] = speed
        print(line.strip())
        pair.start(motor["A"], motor["B"] * -1)
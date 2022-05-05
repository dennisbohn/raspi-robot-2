from buildhat import Motor
import re
import sys
import logging

motor = {
    'A': Motor('A'),
    'B': Motor('B')
}
pattern = re.compile("^[AB]\-?\d+$")

for line in sys.stdin:
    print(line)
    if (line.strip().upper() == "STOP"):
        motor["A"].stop()
        motor["B"].stop()
    else:
        splits = line.strip().upper().split()
        for split in splits:
            if (re.match(pattern, split)):
                wheel = split[0:1]
                speed = int(split[1:])
                if (wheel == "A"):
                    print("motorA")
                    motor["A"].start(speed)
                if (wheel == "B"):
                    print("motorB")
                    motor["B"].start(speed * -1)

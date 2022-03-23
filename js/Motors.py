from buildhat import Motor
import re
import sys
import logging

motorA = Motor('A')
motorB = Motor('B')

motorA.off()
motorB.off()

motor = {
    'A': motorA,
    'B': motorB
}
pattern = re.compile("^[AB]\d+$")

print("start")
for line in sys.stdin:
    print(line.strip())
    splits = line.strip().upper().split()
    for split in splits:
        if (re.match(pattern, split)):
            wheel = split[0:1]
            speed = int(split[1:])
            motor[wheel].start(speed)
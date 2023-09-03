import time
a = 10
v = 0
y = 500
while True:
    time.sleep(1)
    v += a
    y += v
    print(y)

'''
BUS_A_INTERVAL = 15
BUS_B_INTERVAL = 13
BUS_C_INTERVAL = 8
BUS_A_STOP_HOURS = 23
BUS_B_STOP_HOURS = 23
BUS_C_STOP_HOURS = 22
BUS_A_START_HOURS = 6
BUS_A_START_MINUTES = 0
BUS_B_START_HOURS = 6
BUS_B_START_MINUTES = 0
BUS_C_START_HOURS = 6
BUS_C_START_MINUTES = 20
busAhours = BUS_A_START_HOURS
busAminutes = BUS_A_START_MINUTES
busBhours = BUS_B_START_HOURS
busBminutes = BUS_B_START_MINUTES
busChours = BUS_C_START_HOURS
busCminutes = BUS_C_START_MINUTES
minutes = 0
busACount = 0
busBCount = 0
busCCount = 0
'''
'''
while minutes <= 1440:
    if busAhours == busBhours and busAminutes == busBminutes:
        print("busA와 busB 동시 정차!!", busAhours, ":", busAminutes)
    if minutes >= 20:
        if busAhours == busChours and busAminutes == busCminutes:
            print("busA와 busC 동시 정차!!", busAhours, ":", busAminutes)
        if busBhours == busChours and busBminutes == busCminutes:
            print("busB와 busC 동시 정차!!", busBhours, ":", busBminutes)
    if busAhours == busBhours and busAminutes == busBminutes and busBhours == busChours and busBminutes == busCminutes:
        print("busA, busB, busC 동시 정차!!", busAhours, ":", busAminutes)
    if busACount <= BUS_A_INTERVAL:
        busAminutes += BUS_A_INTERVAL
        if busAminutes >= 60:
            busAminutes -= 60
            busAhours += 1
        busACount = 0
    if busBCount <= BUS_B_INTERVAL:
        busBminutes += BUS_B_INTERVAL
        if busBminutes >= 60:
            busBminutes -= 60
            busBhours += 1
        busBCount = 0
    if minutes >= 20:
        if busCCount <= BUS_C_INTERVAL:
            busCminutes += BUS_C_INTERVAL
            if busCminutes >= 60:
                busCminutes -= 60
                busChours += 1
            busCCount = 0
    # if busCCount != 1000:
    busCCount += 1
    # if busBCount != 1000:
    busBCount += 1
    # if busACount != 1000:
    busACount += 1
    minutes += 1
'''
'''
    if busAhours == busBhours and busAminutes == busBminutes:
        print("busA와 busB 동시 정차!!", busAhours, ":", busAminutes)
    if busAhours == busChours and busAminutes == busCminutes:
        print("busA와 busC 동시 정차!!", busAhours, ":", busAminutes)
    if busBhours == busChours and busBminutes == busCminutes:
        print("busB와 busC 동시 정차!!", busBhours, ":", busBminutes)
    if busAhours == busBhours and busAminutes == busBminutes and busBhours == busChours and busBminutes == busCminutes:
        print("busA, busB, busC 동시 정차!!", busAhours, ":", busAminutes)
    busAminutes += BUS_A_INTERVAL
    if busAminutes >= 60:
        busAminutes -= 60
        busAhours += 1
    busBminutes += BUS_B_INTERVAL
    if busBminutes >= 60:
        busBminutes -= 60
        busBhours += 1
    busCminutes += BUS_C_INTERVAL
    if busCminutes >= 60:
        busCminutes -= 60
        busChours += 1
    if busAhours == busBhours and busAminutes == busBminutes:
        print("busA와 busB 동시 정차!!", busAhours, ":", busAminutes)
    if busAhours == busChours and busAminutes == busCminutes:
        print("busA와 busC 동시 정차!!", busAhours, ":", busAminutes)
    if busBhours == busChours and busBminutes == busCminutes:
        print("busB와 busC 동시 정차!!", busBhours, ":", busBminutes)
    if busAhours == busBhours and busAminutes == busBminutes and busBhours == busChours and busBminutes == busCminutes:
        print("busA, busB, busC 동시 정차!!", busAhours, ":", busAminutes)
    busAminutes += BUS_A_INTERVAL
    if busAminutes >= 60:
        busAminutes -= 60
        busAhours += 1
    busBminutes += BUS_B_INTERVAL
    if busBminutes >= 60:
        busBminutes -= 60
        busBhours += 1
    busCminutes += BUS_C_INTERVAL
    if busCminutes >= 60:
        busCminutes -= 60
        busChours += 1
    '''
'''
while minutes <= 1440:
    if busAhours == busBhours and busAminutes == busBminutes:
        print("busA와 busB 동시 정차!!", busAhours, ":", busAminutes)
    if minutes >= 20:
        if busAhours == busChours and busAminutes == busCminutes:
            print("busA와 busC 동시 정차!!", busAhours, ":", busAminutes)
        if busBhours == busChours and busBminutes == busCminutes:
            print("busB와 busC 동시 정차!!", busBhours, ":", busBminutes)
    if busAhours == busBhours and busAminutes == busBminutes and busBhours == busChours and busBminutes == busCminutes:
        print("busA, busB, busC 동시 정차!!", busAhours, ":", busAminutes)
    busAminutes += BUS_A_INTERVAL
    if busAminutes >= 60:
        busAminutes -= 60
        busAhours += 1
    busBminutes += BUS_B_INTERVAL
    if busBminutes >= 60:
        busBminutes -= 60
        busBhours += 1
    if minutes >= 20:
        busCminutes += BUS_C_INTERVAL
        if busCminutes >= 60:
            busCminutes -= 60
            busChours += 1
    minutes += 1
'''
'''
busBminutes = 0
busChours = 6
busCminutes = 20
BUS_A_INTERVAL = 15
BUS_B_INTERVAL = 13
BUS_C_INTERVAL = 8
BUS_A_STOP_HOURS = 23
BUS_B_STOP_HOURS = 23
BUS_C_STOP_HOURS = 22
BUS_A_START_HOURS = 6
BUS_A_START_MINUTES = 0
BUS_B_START_HOURS = 6
BUS_B_START_MINUTES = 0
BUS_C_START_HOURS = 6
BUS_C_START_MINUTES = 20
minutes = 0
busAhours = BUS_A_START_HOURS
busAminutes = BUS_A_START_MINUTES
busBhours = BUS_B_START_HOURS


def print_time(hours, minutes):
    return f"{hours}:{minutes:02d}"


while minutes <= 1020:
    if busAhours == busBhours and busAminutes == busBminutes and busAhours == busChours and busAminutes == busCminutes:
        print("busA, busB, busC 동시 정차!!", print_time(busAhours, busAminutes))
    elif busAhours == busBhours and busAminutes == busBminutes:
        print("busA와 busB 동시 정차!!", print_time(busAhours, busAminutes))
    elif busAhours == busChours and busAminutes == busCminutes:
        print("busA와 busC 동시 정차!!", print_time(busAhours, busAminutes))
    elif busBhours == busChours and busBminutes == busCminutes:
        print("busB와 busC 동시 정차!!", print_time(busBhours, busBminutes))
    if busAhours < BUS_A_STOP_HOURS or (busAhours == BUS_A_STOP_HOURS and busAminutes < 60):
        busAminutes += BUS_A_INTERVAL
        if busAminutes >= 60:
            busAminutes -= 60
            busAhours += 1
    if busBhours < BUS_B_STOP_HOURS or (busBhours == BUS_B_STOP_HOURS and busBminutes < 60):
        busBminutes += BUS_B_INTERVAL
        if busBminutes >= 60:
            busBminutes -= 60
            busBhours += 1
    if busChours < BUS_C_STOP_HOURS or (busChours == BUS_C_STOP_HOURS and busCminutes < 60):
        busCminutes += BUS_C_INTERVAL
        if busCminutes >= 60:
            busCminutes -= 60
            busChours += 1
    minutes += 1
'''
bus_a_start = 6 * 60
bus_b_start = 6 * 60
bus_c_start = 6 * 60 + 20
bus_a_interval = 15
bus_b_interval = 13
bus_c_interval = 8
end_time = 23 * 60
times = []
for time in range(bus_a_start, end_time, 1):
    if (time - bus_a_start) % bus_a_interval == 0 and (time - bus_b_start) % bus_b_interval == 0:
        times.append((time, 'A', 'B'))
    if (time - bus_a_start) % bus_a_interval == 0 and (time - bus_c_start) % bus_c_interval == 0:
        times.append((time, 'A', 'C'))
    if (time - bus_b_start) % bus_b_interval == 0 and (time - bus_c_start) % bus_c_interval == 0:
        times.append((time, 'B', 'C'))
def format_time(minutes):
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours}:{mins:02}"
for time, bus1, bus2 in times:
    print(f"bus{bus1}와 bus{bus2} 동시 정차!! {format_time(time)}")
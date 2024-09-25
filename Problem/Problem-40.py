def modify(list):
    for i in range(len(list)):
        list[i] = (list[i] *0.3)+list[i]

def main():
    list = [200,250,300,280,500]
    modify(list)
    print(f"{list}")
main()
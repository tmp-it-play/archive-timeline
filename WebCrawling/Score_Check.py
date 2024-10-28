a=list(map(int,input().split()))
b=[]
for i in a:
    if i >= 70:
        b.append("합격")
    else:
        b.append("불합격")
c,d,e=b
print(f"{c},{d},{e}")
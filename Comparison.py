from math import sqrt, ceil

n1 = sqrt(3.0)
if abs(n1 * n1 == 3.0) < 0.00001:
    print("sqrt(3.0)*sqrt(3.0)은 3.0과 같다.")
    n2=n1
    n1 = ceil(n1)
else:
    print("sqrt(3.0)*sqrt(3.0)은 3.0과 같지 않다.")
print("sqrt(3.0)*sqrt(3.0)은 %d(%.16f)이다." % (n1, n2 * n2))
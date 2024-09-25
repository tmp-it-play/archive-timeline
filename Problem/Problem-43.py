LIMIT = 30
pythagoras = [result for result in
              [(a, b, c) for a in range(1, LIMIT) for b in range(a, LIMIT) for c in range(b, LIMIT) if
               pow(a, 2) + pow(b, 2) == pow(c, 2)]]
print(pythagoras)
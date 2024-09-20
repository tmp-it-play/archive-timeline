score = []
for i in range(5):
    score.append(int(input()))
print("평균값: ", sum(score) / len(score))
print("최대값: ", max(score))
print("최소값: ", min(score))
count = 0
for i in range(len(score)):
    if score[i] >= 80:
        count += 1
print("80점 이상: ", count)
score_dic = {"Kim": [99, 83, 95], "Lee": [68, 45, 78], "Choi": [25, 56, 69]}
for key in score_dic:
    print(f"{key}의 평균성적= {sum(score_dic[key]) / 3}")
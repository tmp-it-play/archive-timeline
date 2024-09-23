friends = ["Alice", "Bob", "Charlie", "Alice", "David", "Eve"]


def overlap_word():
    friends.sort()
    for i in range(len(friends)):
        if len(friends) == i + 1:
            break
        if friends[i] == friends[i + 1]:
            friends.remove(friends[i])
    return friends


print(overlap_word())
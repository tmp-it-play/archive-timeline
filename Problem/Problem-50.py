text_data = "Create the highest, grandest vision possible for your life, because you become what you believe."


def word_counter():
    word_dict = {}
    for word in text_data.split():
        if word in word_dict:
            word_dict[word] += 1
        else:
            word_dict[word] = 1
    return word_dict


print(word_counter())
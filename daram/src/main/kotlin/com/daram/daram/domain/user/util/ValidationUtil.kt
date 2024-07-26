package com.daram.daram.domain.user.util

import com.daram.daram.domain.user.dto.UserDto
import com.daram.daram.global.exception.InvalidUserInputException

object ValidationUtil {
    fun validateUserDto(userDto: UserDto) {
        if (userDto.name.isNullOrBlank() || userDto.etc.isNullOrBlank() || userDto.spec.isNullOrBlank() || userDto.self_introduction.isNullOrBlank() || userDto.portfolio.isNullOrBlank()) {
            throw InvalidUserInputException("All fields must be provided and cannot be empty")
        }
    }
}
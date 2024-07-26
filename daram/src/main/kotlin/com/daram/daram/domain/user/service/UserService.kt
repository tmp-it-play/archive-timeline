package com.daram.daram.domain.user.service

import com.daram.daram.domain.user.dto.UserDto
import com.daram.daram.domain.user.entity.User
import com.daram.daram.domain.user.mapper.toDto
import com.daram.daram.domain.user.mapper.toEntity
import com.daram.daram.domain.user.repository.UserRepository
import com.daram.daram.domain.user.util.ValidationUtil
import com.daram.daram.global.exception.InvalidUserInputException
import com.daram.daram.global.exception.UserNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository
) {

    @Transactional
    fun createUser(userDto: UserDto): User {
        try {
            ValidationUtil.validateUserDto(userDto)
            val user = userDto.toEntity()
            return userRepository.save(user)
        } catch (e: InvalidUserInputException) {
            throw e
        }
    }

    @Transactional(readOnly = true)
    fun getUser(id: Integer): UserDto {
        val user: User? = userRepository.findById(id).orElse(null)
        if (user != null) {
            return user.toDto()
        } else {
            throw UserNotFoundException("User with id $id not found")
        }
    }
}
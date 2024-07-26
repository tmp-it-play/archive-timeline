package com.daram.daram.controller

import com.daram.daram.domain.user.dto.UserDto
import com.daram.daram.domain.user.service.UserService
import com.daram.daram.global.Response
import com.daram.daram.global.exception.InvalidUserInputException
import com.daram.daram.global.exception.UserNotFoundException
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/user")
class UserController(private val userService: UserService) {

    @PostMapping
    fun register(@RequestBody userDto: UserDto): Response<String> {
        return try {
            userService.createUser(userDto)
            Response(
                success = "true", message = "User registered successfully", data = "User has been created."
            )
        } catch (e: InvalidUserInputException) {
            Response(
                success = "false", message = e.message ?: "Invalid input", data = null
            )
        }
    }

    @GetMapping("/{id}")
    fun getUser(@PathVariable("id") id: Integer): Response<UserDto?> {
        return try {
            val userDto = userService.getUser(id)
            Response(
                success = "true", message = "User fetched successfully", data = userDto
            )
        } catch (e: UserNotFoundException) {
            Response(
                success = "false", message = e.message ?: "User not found", data = null
            )
        } catch (e: Exception) {
            Response(
                success = "false", message = e.message ?: "An error occurred", data = null
            )
        }
    }
}
package com.snowykte0426.eventsourcing.presentation.user

import com.snowykte0426.eventsourcing.domain.user.command.RegisterUserCommand
import com.snowykte0426.eventsourcing.domain.user.service.UserService
import com.snowykte0426.eventsourcing.presentation.user.dto.RegisterUserRequest
import com.snowykte0426.eventsourcing.presentation.user.dto.UserResponse
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.*
@Component
class UserHandler(
    private val userService: UserService
) {

    suspend fun registerUser(request: ServerRequest): ServerResponse {
        val req = request.awaitBody<RegisterUserRequest>()
        val command = RegisterUserCommand(
            req.userId,
            req.username,
            req.email
        )
        userService.registerUser(command).awaitFirstOrNull()
        return ServerResponse.ok().buildAndAwait()
    }

    suspend fun getUser(request: ServerRequest): ServerResponse {
        val userId = request.pathVariable("id")
        val aggregate = userService.getUser(userId).awaitSingle()
        val response = UserResponse(aggregate.id, aggregate.username, aggregate.email)
        return ServerResponse.ok().bodyValueAndAwait(response)
    }
}
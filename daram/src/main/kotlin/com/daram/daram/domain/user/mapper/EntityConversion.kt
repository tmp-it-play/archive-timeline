package com.daram.daram.domain.user.mapper

import com.daram.daram.domain.user.dto.UserDto
import com.daram.daram.domain.user.entity.User

fun User.toDto() = UserDto(
    id = this.id,
    name = this.name,
    etc = this.etc,
    spec = this.spec,
    self_introduction = this.selfIntroduction,
    portfolio = this.portfolio
)

fun UserDto.toEntity() = User(
    id = this.id,
    name = this.name ?: "",
    etc = this.etc,
    spec = this.spec,
    selfIntroduction = this.self_introduction,
    portfolio = this.portfolio
)
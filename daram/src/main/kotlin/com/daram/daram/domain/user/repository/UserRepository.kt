package com.daram.daram.domain.user.repository

import com.daram.daram.domain.user.entity.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Integer>
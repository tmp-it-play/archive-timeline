package com.daram.daram.domain.user.entity

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null,

    @Column(nullable = false) val name: String = "",

    @Column val etc: String? = null,

    @Column val spec: String? = null,

    @Column(name = "self_introduction") val selfIntroduction: String? = null,

    @Column val portfolio: String? = null
) {
    constructor() : this(
        id = null, name = "", etc = null, spec = null, selfIntroduction = null, portfolio = null
    )
}
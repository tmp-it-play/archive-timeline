package com.daram.daram.global

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Response<T>(
    val success: String, val message: String, val data: T? = null
)
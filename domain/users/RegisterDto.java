package com.example.riotdo.REST_Board.domain.users;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class RegisterDto {
    private String username;
    private String password;
    private String name;
}
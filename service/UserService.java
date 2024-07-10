package com.example.riotdo.REST_Board.service;

import com.example.riotdo.REST_Board.Entity.User;
import com.example.riotdo.REST_Board.repository.UserRepository;
import com.example.riotdo.REST_Board.dto.RegisterDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User register(RegisterDto registerDto) {
        User user = new User();
        user.setName(registerDto.getName());
        user.setPassword((registerDto.getPassword()));
        user.setUsername((registerDto.getUsername()));
        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findUser(int id) {
        return userRepository.findById(id).orElseThrow(() -> {
            return new IllegalArgumentException("User ID를 찾을 수 없습니다.");
        });
    }
}
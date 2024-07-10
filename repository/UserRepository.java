package com.example.riotdo.REST_Board.repository;

import com.example.riotdo.REST_Board.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
}
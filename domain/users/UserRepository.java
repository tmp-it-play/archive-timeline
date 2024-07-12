package com.example.riotdo.REST_Board.domain.users;

import com.example.riotdo.REST_Board.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
}
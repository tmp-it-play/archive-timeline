package com.snowykte0426.minsole.domain.auth.repository;

import com.snowykte0426.minsole.domain.auth.entity.Provider;
import com.snowykte0426.minsole.domain.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByProviderAndProviderId(Provider provider, String providerId);
    
    boolean existsByEmail(String email);
}

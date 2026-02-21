package com.abysalto.mid.repository;

import com.abysalto.mid.entity.Cart;
import com.abysalto.mid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
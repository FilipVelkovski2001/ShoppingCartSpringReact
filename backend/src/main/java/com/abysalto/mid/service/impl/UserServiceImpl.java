package com.abysalto.mid.service.impl;

import com.abysalto.mid.dto.response.UserDto;
import com.abysalto.mid.entity.User;
import com.abysalto.mid.exception.ResourceNotFoundException;
import com.abysalto.mid.repository.UserRepository;
import com.abysalto.mid.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDto getCurrentUser(String username) {
        User user = getUser(username);
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserDto addToFavorites(String username,
            Integer productId) {
        User user = getUser(username);
        user.getFavoriteProductIds().add(productId);
        userRepository.save(user);
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserDto removeFromFavorites(String username,
            Integer productId) {
        User user = getUser(username);
        user.getFavoriteProductIds().remove(productId);
        userRepository.save(user);
        return mapToResponse(user);
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(
                () -> new ResourceNotFoundException("User not found"));
    }

    private UserDto mapToResponse(User user) {
        return UserDto.builder()
                      .id(user.getId())
                      .username(user.getUsername())
                      .email(user.getEmail())
                      .firstName(user.getFirstName())
                      .lastName(user.getLastName())
                      .favoriteProductIds(user.getFavoriteProductIds())
                      .build();
    }
}

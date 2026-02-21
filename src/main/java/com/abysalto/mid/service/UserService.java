package com.abysalto.mid.service;

import com.abysalto.mid.dto.response.UserDto;

public interface UserService {
    UserDto getCurrentUser(String username);

    UserDto addToFavorites(String username, Integer productId);

    UserDto removeFromFavorites(String username, Integer productId);
}

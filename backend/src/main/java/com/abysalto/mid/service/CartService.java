package com.abysalto.mid.service;

import com.abysalto.mid.dto.request.AddItem;
import com.abysalto.mid.dto.request.UpdateQuantity;
import com.abysalto.mid.dto.response.CartDto;

public interface CartService {
    CartDto getCart(String username);

    CartDto addItem(String username, AddItem request);

    CartDto updateItemQuantity(String username, Integer productId, UpdateQuantity request);


    CartDto removeItem(String username, Integer productId);

    void clearCart(String username);
}

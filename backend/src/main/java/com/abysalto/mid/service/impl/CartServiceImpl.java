package com.abysalto.mid.service.impl;

import com.abysalto.mid.dto.request.AddItem;
import com.abysalto.mid.dto.response.CartDto;
import com.abysalto.mid.dto.response.CartItemDto;
import com.abysalto.mid.entity.Cart;
import com.abysalto.mid.entity.CartItem;
import com.abysalto.mid.entity.User;
import com.abysalto.mid.exception.ResourceNotFoundException;
import com.abysalto.mid.repository.CartRepository;
import com.abysalto.mid.repository.UserRepository;
import com.abysalto.mid.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Override
    public CartDto getCart(String username) {
        User user = getUser(username);
        Cart cart = cartRepository.findByUser(user)
                                  .orElseGet(() -> createEmptyCart(user));
        return mapToDto(cart);
    }

    @Override
    @Transactional
    public CartDto addItem(String username, AddItem request) {
        User user = getUser(username);
        Cart cart = cartRepository.findByUser(user)
                                  .orElseGet(() -> createEmptyCart(user));

        Optional<CartItem> existing = cart.getItems().stream()
                                          .filter(item -> item.getProductId()
                                                              .equals(request.getProductId()))
                                          .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(
                    existing.get().getQuantity() + request.getQuantity());
        } else {
            CartItem item = CartItem.builder().cart(cart)
                                    .productId(request.getProductId())
                                    .quantity(request.getQuantity())
                                    .productTitle(request.getProductTitle())
                                    .productPrice(request.getProductPrice())
                                    .productThumbnail(
                                            request.getProductThumbnail())
                                    .build();
            cart.getItems().add(item);
        }

        cartRepository.save(cart);
        return mapToDto(cart);
    }

    @Override
    @Transactional
    public CartDto updateItemQuantity(String username, Integer productId,
            Integer quantity) {
        User user = getUser(username);
        Cart cart = cartRepository.findByUser(user).orElseThrow(
                () -> new ResourceNotFoundException("Cart not found"));

        if (quantity <= 0) {
            return removeItem(username, productId);
        }

        cart.getItems().stream()
            .filter(item -> item.getProductId().equals(productId)).findFirst()
            .ifPresent(item -> item.setQuantity(quantity));

        cartRepository.save(cart);
        return mapToDto(cart);
    }

    @Override
    @Transactional
    public CartDto removeItem(String username, Integer productId) {
        User user = getUser(username);
        Cart cart = cartRepository.findByUser(user).orElseThrow(
                () -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        cartRepository.save(cart);
        return mapToDto(cart);
    }

    @Override
    @Transactional
    public void clearCart(String username) {
        User user = getUser(username);
        cartRepository.findByUser(user).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(
                () -> new ResourceNotFoundException("User not found"));
    }

    private Cart createEmptyCart(User user) {
        Cart cart = Cart.builder().user(user).build();
        return cartRepository.save(cart);
    }

    private CartDto mapToDto(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream()
                                      .map(item -> CartItemDto.builder()
                                                              .id(item.getId())
                                                              .productId(
                                                                      item.getProductId())
                                                              .quantity(
                                                                      item.getQuantity())
                                                              .productTitle(
                                                                      item.getProductTitle())
                                                              .productPrice(
                                                                      item.getProductPrice())
                                                              .productThumbnail(
                                                                      item.getProductThumbnail())
                                                              .subtotal(
                                                                      item.getProductPrice() != null
                                                                              ? Math.round(
                                                                              item.getProductPrice() * item.getQuantity() * 100.0) / 100.0
                                                                              : 0.0)
                                                              .build())
                                      .collect(Collectors.toList());

        double total =
                items.stream().mapToDouble(CartItemDto::getSubtotal).sum();

        int totalItems =
                items.stream().mapToInt(CartItemDto::getQuantity).sum();

        return CartDto.builder().id(cart.getId()).items(items)
                      .total(Math.round(total * 100.0) / 100.0)
                      .totalItems(totalItems).build();
    }
}
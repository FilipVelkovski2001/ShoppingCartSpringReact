package com.abysalto.mid.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private Long id;
    private Integer productId;
    private Integer quantity;
    private String productTitle;
    private Double productPrice;
    private String productThumbnail;
    private Double subtotal;
}

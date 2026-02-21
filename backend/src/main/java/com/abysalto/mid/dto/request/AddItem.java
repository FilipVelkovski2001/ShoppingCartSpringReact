package com.abysalto.mid.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddItem {
    @NotNull
    private Integer productId;

    @NotNull
    @Min(1)
    private Integer quantity;

    private String productTitle;
    private Double productPrice;
    private String productThumbnail;
}

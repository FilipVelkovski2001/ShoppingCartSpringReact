package com.abysalto.mid.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateQuantity {

    @NotNull
    @Min(0)
    private Integer quantity;
}

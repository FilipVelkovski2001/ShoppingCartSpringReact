package com.abysalto.mid.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class Login {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}

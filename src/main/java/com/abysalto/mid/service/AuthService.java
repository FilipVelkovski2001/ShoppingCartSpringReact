package com.abysalto.mid.service;

import com.abysalto.mid.dto.request.Login;
import com.abysalto.mid.dto.request.Register;
import com.abysalto.mid.dto.response.AuthDto;

public interface AuthService {
    AuthDto register(Register request);

    AuthDto login(Login request);
}

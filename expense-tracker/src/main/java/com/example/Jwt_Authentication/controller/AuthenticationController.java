package com.example.Jwt_Authentication.controller;


import com.example.Jwt_Authentication.Dto.AuthenticationRequest;
import com.example.Jwt_Authentication.Dto.AuthenticationResponse;
import com.example.Jwt_Authentication.Dto.MessageResponse;
import com.example.Jwt_Authentication.Dto.RegisterRequest;
import com.example.Jwt_Authentication.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private  final AuthenticationService authenticationService;

    @PostMapping("/register")

    public ResponseEntity<MessageResponse> register (@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authenticationService.register(request));

    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate (@RequestBody AuthenticationRequest request ){
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authenticationService.refreshToken(request, response);
    }
}



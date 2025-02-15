package com.example.Jwt_Authentication.controller;

import com.example.Jwt_Authentication.Dto.UserResponse;
import com.example.Jwt_Authentication.model.User;
import com.example.Jwt_Authentication.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class User_controller {
    private final UserService userService;

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.loadUserByUsername(userDetails.getUsername());
        UserResponse userResponse = UserResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .id(user.getId())
                .build();

        return userResponse ;
    }

}
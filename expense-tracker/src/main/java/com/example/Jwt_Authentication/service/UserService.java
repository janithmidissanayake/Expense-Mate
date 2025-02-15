package com.example.Jwt_Authentication.service;


import com.example.Jwt_Authentication.model.User;
import com.example.Jwt_Authentication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService  implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsersExcept(Long adminUserId) {
        // Fetch all users from the database
        List<User> allUsers = userRepository.findAll();

        // Filter out the user with the specified adminUserId
        List<User> usersExcludingAdmin = allUsers.stream()
                .filter(user -> !user.getId().equals(adminUserId)) // Exclude the admin user
                .collect(Collectors.toList());

        return usersExcludingAdmin;
    }
}

package com.example.Jwt_Authentication.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public enum Role {
    USER(
            Set.of(
                    Permission.USER_CREATE,
                    Permission.USER_READ,
                    Permission.USER_DELETE,
                    Permission.USER_UPDATE
            )
    ),
    ADMIN(
            Set.of(
                    Permission.ADMIN_READ,
                    Permission.ADMIN_UPDATE,
                    Permission.ADMIN_CREATE,
                    Permission.ADMIN_DELETE,
                    Permission.CATEGORY_CREATE,
                    Permission.CATEGORY_UPDATE,
                    Permission.CATEGORY_DELETE

            )
    ),;

    @Getter
    private final Set<Permission> permissions;

//    @JsonCreator
//    public static Role fromString(String role) {
//        return valueOf(role.toUpperCase());
//    }


    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());

        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name())); // Include ROLE_ prefix
        return authorities;
    }

}

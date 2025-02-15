package com.example.Jwt_Authentication.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),
CATEGORY_CREATE("category:create")  ,
    CATEGORY_UPDATE("category:update"),
    CATEGORY_DELETE("category:delete"),
    USER_READ("user:read"),
    USER_CREATE("user:create"),
    USER_UPDATE("user:update"),
    USER_DELETE("user:delete");

//    MANAGER_READ("manager:read"),
//    MANAGER_UPDATE("manager:update"),
//    MANAGER_CREATE("manager:create"),
//    MANAGER_DELETE("manager:delete");

    @Getter
    private final String permission;

}

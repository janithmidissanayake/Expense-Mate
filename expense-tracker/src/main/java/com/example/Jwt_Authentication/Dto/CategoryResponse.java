package com.example.Jwt_Authentication.Dto;


import com.example.Jwt_Authentication.model.CategoryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {

    private Long id;
    private String name;
    private CategoryType type;

}

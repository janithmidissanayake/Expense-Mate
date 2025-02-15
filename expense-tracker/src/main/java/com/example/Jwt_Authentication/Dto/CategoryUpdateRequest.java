package com.example.Jwt_Authentication.Dto;

import com.example.Jwt_Authentication.model.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryUpdateRequest {
//    private Long id;
    @NotBlank
    private String name;

    @NotNull(message = "Category type must not be null")
    private CategoryType type;
}

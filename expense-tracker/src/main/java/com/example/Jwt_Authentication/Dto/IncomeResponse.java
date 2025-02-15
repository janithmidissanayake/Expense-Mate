package com.example.Jwt_Authentication.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IncomeResponse {
    private Long id; // Unique identifier for the income
    private Integer amount; // Income amount
    private String description; // Description of the income
    private LocalDate incomeDate; // Date of the income
    private String categoryName; // Name of the associated category
    private Long categoryId;
}

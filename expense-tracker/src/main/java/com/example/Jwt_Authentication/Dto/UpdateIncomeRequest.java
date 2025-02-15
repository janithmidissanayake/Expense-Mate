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
public class UpdateIncomeRequest {
    private String description;
    private Integer amount;
    private LocalDate incomeDate;
    private String categoryName; // Accepts category name from frontend
}

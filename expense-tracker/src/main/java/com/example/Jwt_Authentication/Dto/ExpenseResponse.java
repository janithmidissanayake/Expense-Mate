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
public class ExpenseResponse {
    private Long id;
    private String title;
    private Integer amount;
    private String description;
    private LocalDate expenseDate;
    private Long categoryId;
    private String categoryName; // Name of the associated category
}

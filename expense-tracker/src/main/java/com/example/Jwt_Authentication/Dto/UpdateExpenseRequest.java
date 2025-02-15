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
public class UpdateExpenseRequest {
    private String title;
    private String description;
    private Integer amount;
    private LocalDate expenseDate;
    private String categoryName; // Accepts category name from frontend

}

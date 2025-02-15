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
public class IncomeRequest {
    private Integer amount;

    private String description;

    private LocalDate incomeDate;
    private Long categoryId;
}

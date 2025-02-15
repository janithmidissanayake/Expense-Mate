package com.example.Jwt_Authentication.controller;

import com.example.Jwt_Authentication.Dto.CategorySummaryResponse;
import com.example.Jwt_Authentication.Dto.MonthlySummary;
import com.example.Jwt_Authentication.Dto.SummaryResponse;
import com.example.Jwt_Authentication.model.CategoryType;
import com.example.Jwt_Authentication.service.CategoryService;
import com.example.Jwt_Authentication.service.FinancialSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/summary-controller")
@RequiredArgsConstructor
public class SummaryController {
    private final FinancialSummaryService financialSummaryService;
    private final CategoryService categoryService;

    @GetMapping("/summary")
    @ResponseStatus(HttpStatus.OK)
    public SummaryResponse getSummary(@RequestParam Long userId){
        return financialSummaryService.getSummary(userId);
    }

    @GetMapping("/monthly-summary")
    @ResponseStatus(HttpStatus.OK)
    public List<MonthlySummary> getMonthlySummary(@RequestParam Long userId) {
        return financialSummaryService.getMonthlySummaryWithCalculatedBalance(userId);
    }

    @GetMapping("/category-IncomeSummary")
    @ResponseStatus(HttpStatus.OK)
    public List<CategorySummaryResponse>getCategorySummaryForIncome (@RequestParam Long userId){
        return financialSummaryService.getCategorySummary(userId, CategoryType.INCOME);

    }

    @GetMapping("/category-ExpenseSummary")
    @ResponseStatus(HttpStatus.OK)
    public List<CategorySummaryResponse>getCategorySummaryExpense (@RequestParam Long userId){
        return financialSummaryService.getCategorySummary(userId, CategoryType.EXPENSE);

    }

}

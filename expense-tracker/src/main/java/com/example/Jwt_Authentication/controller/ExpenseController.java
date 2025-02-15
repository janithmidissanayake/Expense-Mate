package com.example.Jwt_Authentication.controller;

import com.example.Jwt_Authentication.Dto.*;
import com.example.Jwt_Authentication.service.ExpenseService;
import com.example.Jwt_Authentication.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expense-controller")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping("/createExpense")
    @ResponseStatus(HttpStatus.CREATED)
    public void addExpense(@RequestBody ExpenseRequest request, @RequestParam Long userId) throws Exception {
        expenseService.addExpense(request,userId);
    }

    @GetMapping("/expenses")
    @ResponseStatus(HttpStatus.OK)
    public List<ExpenseResponse> getAllExpense(@RequestParam Long userId) throws Exception {
        return expenseService.getAllExpense(userId);
    }

    @PutMapping("/update-expense/{expenseId}")
    @ResponseStatus(HttpStatus.OK)
    public UpdateExpenseResponse updateExpense (@RequestBody UpdateExpenseRequest request, @RequestParam Long userId, @PathVariable Long expenseId){
        return expenseService.updateExpense(expenseId,userId,request);

    }

    @DeleteMapping("/delete-expense/{expenseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Return 204 No Content on successful deletion
    public void deleteExpense(@PathVariable Long expenseId, @RequestParam Long userId) {
        expenseService.deleteExpense(expenseId, userId);
    }

}

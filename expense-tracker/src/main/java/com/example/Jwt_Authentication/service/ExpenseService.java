package com.example.Jwt_Authentication.service;

import com.example.Jwt_Authentication.Dto.*;
import com.example.Jwt_Authentication.model.*;
import com.example.Jwt_Authentication.repository.CategoryRepository;
import com.example.Jwt_Authentication.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final UserService userService;
    private final CategoryRepository categoryRepository;

    public void addExpense(ExpenseRequest request, Long userId) {
        User user = userService.getUserById(userId);
        Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);

        var expense = Expense.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .expenseDate(request.getExpenseDate())
                .amount(request.getAmount())
                .category(category)
                .user(user)
                .build();
        expenseRepository.save(expense);


    }

    public List<ExpenseResponse> getAllExpense(Long userId) {
        User user = userService.getUserById(userId);
        List<Expense> expenseList = expenseRepository.findByUser_IdAndCategory_TypeAndNotDeleted(userId, CategoryType.EXPENSE);
        return expenseList.stream()
                .map(this::mapToExpenseResponse)
                .collect(Collectors.toList());
    }

    private ExpenseResponse mapToExpenseResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .expenseDate(expense.getExpenseDate())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .categoryName(expense.getCategory().getName()) // Get category name
                .categoryId(expense.getCategory().getId())
                .build();


    }

    public UpdateExpenseResponse updateExpense (Long expenseId, Long userId, UpdateExpenseRequest request){
//        User user = userService.getUserById(userId);
        Expense expense = expenseRepository.findById(expenseId).orElseThrow(
                () -> new IllegalArgumentException("Expense not found with id: " + expenseId));

        if (!expense.getUser().getId().equals(userId)) {
            throw new SecurityException("Access denied: expense does not belong to the user");
        }

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with name: " + request.getCategoryName()));


        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setTitle(request.getTitle());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setCategory(category);
        Expense updatedExpense = expenseRepository.save(expense);

        return new UpdateExpenseResponse(
                updatedExpense.getId(),
                updatedExpense.getTitle(),
                updatedExpense.getAmount(),
                updatedExpense.getDescription(),
                updatedExpense.getExpenseDate(),
                updatedExpense.getCategory().getName()
                // Send category name back to frontend
        );


    }

    public void deleteExpense(Long expenseId, Long userId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Income not found with id: " + expenseId));

        if (!expense.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to delete this expense record.");
        }

        // Mark as deleted instead of removing it
        expense.setDeleted(true);
        expenseRepository.save(expense);
    }


}

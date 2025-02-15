package com.example.Jwt_Authentication.service;

import com.example.Jwt_Authentication.Dto.CategorySummaryResponse;
import com.example.Jwt_Authentication.Dto.MonthlySummary;
import com.example.Jwt_Authentication.Dto.SummaryResponse;
import com.example.Jwt_Authentication.model.Category;
import com.example.Jwt_Authentication.model.Income;

import com.example.Jwt_Authentication.model.CategoryType;
import com.example.Jwt_Authentication.repository.CategoryRepository;
import com.example.Jwt_Authentication.repository.ExpenseRepository;
import com.example.Jwt_Authentication.repository.IncomeRepository;
import com.example.Jwt_Authentication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinancialSummaryService {
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    public SummaryResponse getSummary( Long userId) {
        var totalIncome = incomeRepository.findTotalIncomeByUserId(userId);
        var totalExpense= expenseRepository.findTotalExpenseByUserId(userId);
        var balance =  totalIncome-totalExpense;
        return new SummaryResponse(totalIncome,totalExpense,balance);
   }


    public List<MonthlySummary> getMonthlySummaryWithCalculatedBalance(Long userId) {
        var incomeData = incomeRepository.findMonthlyIncomeByUserId(userId);
        var expenseData = expenseRepository.findMonthlyExpenseByUserId(userId);

        // Map income and expense data for easy lookup
        Map<String, Integer> incomeMap = incomeData.stream()
                .collect(Collectors.toMap(
                        obj -> obj[0] + "-" + obj[1], // Key: "year-month"
                        obj -> ((Number) obj[2]).intValue() // Convert SUM result to Integer
                ));
        Map<String, Integer> expenseMap = expenseData.stream()
                .collect(Collectors.toMap(
                        obj -> obj[0] + "-" + obj[1], // Key: "year-month"
                        obj -> ((Number) obj[2]).intValue() // Convert SUM result to Integer
                ));

        // Merge keys from both income and expense maps
        Set<String> allKeys = new HashSet<>();
        allKeys.addAll(incomeMap.keySet());
        allKeys.addAll(expenseMap.keySet());

        // Create monthly summaries and calculate balance
        return allKeys.stream()
                .map(key -> {
                    String[] parts = key.split("-");
                    int year = Integer.parseInt(parts[0]);
                    int monthNumber = Integer.parseInt(parts[1]);
                    String monthName = Month.of(monthNumber).name(); // Convert to month name
                    monthName = monthName.charAt(0) + monthName.substring(1).toLowerCase(); // Capitalize

                    int income = incomeMap.getOrDefault(key, 0); // Income for the month
                    int expense = expenseMap.getOrDefault(key, 0); // Expense for the month
                    int balance = income - expense; // Calculate balance
                    return new MonthlySummary(year, monthName, income, expense, balance);
                })
                .sorted(Comparator.comparingInt(MonthlySummary::getYear)
                        .thenComparingInt(summary -> Month.valueOf(summary.getMonth().toUpperCase()).getValue()))
                .collect(Collectors.toList());
    }

    public List<CategorySummaryResponse> getCategorySummary(long userId, CategoryType type) {
        // Fetch categories for the user and type (INCOME or EXPENSE)
        List<Category> categories = categoryRepository.findByUserIdAndType(userId, type);

        // Calculate the total amount
//        double totalAmount = categories.stream()
//                .flatMap(category -> {
//                    // Handle income or expense streams based on the type
//                    if (type == CategoryType.INCOME) {
//                        return category.getIncomes().stream().map(income -> income.getAmount());
//                    } else {
//                        return category.getExpenses().stream().map(expense -> expense.getAmount());
//                    }
//                })
//                .mapToDouble(amount -> amount) // Convert the amounts (Double) to primitive double
//                .sum();
        double totalAmount = categories.stream()
                .flatMap(category ->
                        type == CategoryType.INCOME
                                ? category.getIncomes().stream().map(income -> income.getAmount())
                                : category.getExpenses().stream().map(expense -> expense.getAmount())
                )
                .mapToDouble(amount -> amount) // Convert the amounts (Double) to primitive double
                .sum();


        // Map each category to a response with its percentage
        return categories.stream()
                .map(category -> {
                    // Calculate total for each category
                    double categoryTotal = type == CategoryType.INCOME
                            ? category.getIncomes().stream().mapToDouble(income -> income.getAmount()).sum()
                            : category.getExpenses().stream().mapToDouble(expense -> expense.getAmount()).sum();

                    // Calculate percentage
//                    double percentage = totalAmount == 0 ? 0 : (categoryTotal / totalAmount) * 100;

                    // Return a response object for this category
                    return new CategorySummaryResponse(category.getName(), categoryTotal);
                })
                .collect(Collectors.toList());
    }






}

package com.example.Jwt_Authentication.service;

import com.example.Jwt_Authentication.Dto.*;
import com.example.Jwt_Authentication.model.Category;
import com.example.Jwt_Authentication.model.CategoryType;
import com.example.Jwt_Authentication.model.Income;
import com.example.Jwt_Authentication.model.User;
import com.example.Jwt_Authentication.repository.CategoryRepository;
import com.example.Jwt_Authentication.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepository incomeRepository;
    private final UserService userService;
    private final CategoryRepository categoryRepository;


    public void addIncome(IncomeRequest request, Long userId) {
        User user = userService.getUserById(userId);
//        if (user == null) {
//            throw new UserNotFoundException("User not found with id: " + userId);
//        }
//
//        Category category = categoryRepository.findById(request.getCategoryId())
//                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + request.getCategoryId()));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + request.getCategoryId()));

        Income income = Income.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .incomeDate(request.getIncomeDate())
                .user(user)
                .category(category)
                .build();

        incomeRepository.save(income);
    }

    public List<IncomeResponse> getAllIncome (Long userId) {
        User user = userService.getUserById(userId);
        List<Income> incomeList = incomeRepository.findByUser_IdAndCategory_TypeAndNotDeleted(userId, CategoryType.INCOME);
        return incomeList.stream()
                .map(this::mapIncomeResponse)
                .collect(Collectors.toList());

    }

    private IncomeResponse mapIncomeResponse(Income income) {
        return IncomeResponse.builder()
                .id(income.getId())
                .incomeDate(income.getIncomeDate())
                .amount(income.getAmount())
                .description(income.getDescription())
                .categoryName(income.getCategory().getName()) // Get category name
                .categoryId(income.getCategory().getId()) // Get category ID
                .build();
    }

    public UpdateIncomeResponse updateIncome (Long incomeId, Long userId, UpdateIncomeRequest request){
//        User user = userService.getUserById(userId);
        Income income = incomeRepository.findById(incomeId).orElseThrow(
                () -> new IllegalArgumentException("Income not found with id: " + incomeId));

        if (!income.getUser().getId().equals(userId)) {
            throw new SecurityException("Access denied: Income does not belong to the user");
        }

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with name: " + request.getCategoryName()));


        income.setAmount(request.getAmount());
        income.setDescription(request.getDescription());
        income.setIncomeDate(request.getIncomeDate());
        income.setCategory(category); // Save category ID in DB

        // Save updated income
        Income updatedIncome = incomeRepository.save(income);

        // Convert to response DTO
        return new UpdateIncomeResponse(
                        updatedIncome.getId(),
                        updatedIncome.getAmount(),
                        updatedIncome.getDescription(),
                        updatedIncome.getIncomeDate(),
                        updatedIncome.getCategory().getName()
                        // Send category name back to frontend
                );

    }

    public void deleteIncome(Long incomeId, Long userId) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new IllegalArgumentException("Income not found with id: " + incomeId));

        if (!income.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to delete this income record.");
        }

        // Mark as deleted instead of removing it
        income.setDeleted(true);
        incomeRepository.save(income);
    }


}

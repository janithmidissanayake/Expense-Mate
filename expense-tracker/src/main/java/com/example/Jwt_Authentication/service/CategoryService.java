package com.example.Jwt_Authentication.service;
import com.example.Jwt_Authentication.Dto.CategoryUpdateRequest;
import com.example.Jwt_Authentication.model.*;


import com.example.Jwt_Authentication.Dto.CategoryRequest;
import com.example.Jwt_Authentication.Dto.CategoryResponse;
import com.example.Jwt_Authentication.Dto.CategorySummaryResponse;
import com.example.Jwt_Authentication.model.Category;
import com.example.Jwt_Authentication.model.CategoryType;
import com.example.Jwt_Authentication.model.User;
import com.example.Jwt_Authentication.repository.CategoryRepository;
import com.example.Jwt_Authentication.repository.CategoryUserAccessRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class  CategoryService {
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final CategoryUserAccessRepository categoryUserAccessRepository;

    public void createCategory(CategoryRequest request, Long adminUserId) {
        User user = userService.getUserById(adminUserId);
        if (categoryRepository.existsByNameAndUser_Id(request.getName(), adminUserId)) {
            throw new IllegalArgumentException("Category already exists for this user");
        } else {
            var category = Category.builder()
                    .name(request.getName())
                    .type(request.getType())
                    .user(user)
                    .build();
            categoryRepository.save(category);
            grantAccessToCategoryForUsers(category.getId(), adminUserId);  // This will grant access to other users


        }

    }
    public void updateCategory(CategoryUpdateRequest request, Long adminUserId, Long categoryId) {
        User user = userService.getUserById(adminUserId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        if (!category.getUser().getId().equals(adminUserId)) {
            throw new IllegalArgumentException("You do not have permission to update this category");
        }

        if (!category.getName().equals(request.getName()) &&
                categoryRepository.existsByNameAndUser_Id(request.getName(), adminUserId)) {
            throw new IllegalArgumentException("Category name already exists. Choose a different name.");
        }

//        category.setId(request.getId());
        category.setName(request.getName());
        category.setType(request.getType());

        // 6. Save the updated category
        categoryRepository.save(category);
        grantAccessToCategoryForUsers(category.getId(), adminUserId);  // This will grant access to other users



    }

//    public void deleteCategory(Long categoryId, Long adminUserId) {
//        User adminUser = userService.getUserById(adminUserId);
//        boolean isAdmin = isUserAdmin();
//
//        if (isAdmin) {
//            // Check if the category exists
//            Category category = categoryRepository.findById(categoryId)
//                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
//
//            // Check if the adminUser has access to delete this category
//            if (!category.getUser().getId().equals(adminUserId)) {
//                throw new SecurityException("You do not have permission to delete this category");
//            }
//
//            // Soft delete the category
//            category.setDeleted(true);
//            categoryRepository.save(category);
//            grantAccessToCategoryForUsers(category.getId(), adminUserId);
//
//        }





//    }


    private void grantAccessToCategoryForUsers(Long categoryId, Long adminUserId) {
        // Fetch the Category and User entities using their IDs
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        List<User> users = userService.getAllUsersExcept(adminUserId);  // Get all users except the admin

        // Step 6: Add access entries to the `Category_User_Access` table (many-to-many relation)
        for (User user : users) {
            CategoryUserAccess access = new CategoryUserAccess();
            access.setCategory(category); // Set the Category entity
            access.setUser(user); // Set the User entity

            categoryUserAccessRepository.save(access); // Save the entry
        }
    }

    private boolean isUserAdmin(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Access denied: User is not authenticated");
        }

        return authentication.getAuthorities().stream()
         .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

    }

    public List<CategoryResponse> getAllCategoriesForIncome(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserById(userId); // Throws exception if user does not exist


        boolean isAdmin = isUserAdmin();
        List<Category>  incomeCategories;
        if (isAdmin) {
            // Admin should fetch all categories
            incomeCategories = categoryRepository.findByUserIdAndType(userId, CategoryType.INCOME);
        }else{
            incomeCategories = categoryUserAccessRepository.findByUser_Id(userId).stream()
                    .map(CategoryUserAccess::getCategory)
                    .filter(category -> category.getType() == CategoryType.INCOME) // Filter by type
                    .collect(Collectors.toList());
        }

        return incomeCategories.stream()
                .map(category -> CategoryResponse.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .type(category.getType())
                        .build())
                .collect(Collectors.toList());

    }
    public List<CategoryResponse> getAllCategoriesForExpense(Long userId) {
        User user = userService.getUserById(userId); // Throws exception if user does not exist

        boolean isAdmin = isUserAdmin();

        List<Category>  expenseCategories;
        if (isAdmin) {
            // Admin should fetch all categories
            expenseCategories = categoryRepository.findByUserIdAndType(userId, CategoryType.EXPENSE);
        }else{
            expenseCategories = categoryUserAccessRepository.findByUser_Id(userId).stream()
                    .map(CategoryUserAccess::getCategory)
                    .filter(category -> category.getType() == CategoryType.EXPENSE) // Filter by type
                    .collect(Collectors.toList());
        }

        return expenseCategories.stream()
                .map(category -> CategoryResponse.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .type(category.getType())
                        .build())
                .collect(Collectors.toList());

    }



public List<CategoryResponse> getAllCategoriesForUser(Long userId) {
    User user = userService.getUserById(userId); // Throws exception if user does not exist

    logger.debug("Fetching categories for user with ID: {}", userId);
    boolean isAdmin = isUserAdmin();

    List<Category>  categories;

    if (isAdmin) {
        // Admin should fetch all categories
        categories = categoryRepository.findAll();
    } else {
        // Fetch categories the user has access to
        categories = categoryUserAccessRepository.findByUser_Id(userId).stream()
                .map(CategoryUserAccess::getCategory)
                .collect(Collectors.toList());
    }

    return categories .stream()
            .map(this::mapCategoryResponse)
            .collect(Collectors.toList());
}



    public  CategoryResponse getCategoryById (Long id, Long userId) {
        var category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // Ensure the category belongs to the given user
        if (!category.getUser().getId().equals(userId)) {
            throw new SecurityException("Access denied: Category does not belong to the user");
        }

        // Map the Category entity to CategoryResponse
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .build();
    }

    private CategoryResponse mapCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .type(category.getType())
                .name(category.getName())
                .build();
    }
}

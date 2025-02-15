package com.example.Jwt_Authentication.controller;

import com.example.Jwt_Authentication.Dto.CategoryRequest;
import com.example.Jwt_Authentication.Dto.CategoryResponse;
import com.example.Jwt_Authentication.Dto.CategoryUpdateRequest;
import com.example.Jwt_Authentication.Dto.ExpenseRequest;
import com.example.Jwt_Authentication.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category-controller")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/createCategory")
    @PreAuthorize("hasAuthority('category:create')")//    @PreAuthorize("hasAuthority('admin:create')")
    @ResponseStatus(HttpStatus.CREATED)
    public void createCategory(@RequestBody CategoryRequest request,@RequestParam Long userId) throws Exception {
        categoryService.createCategory(request,userId);
    }

    @GetMapping("/categories")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @ResponseStatus(HttpStatus.OK)
    public List<CategoryResponse> getAllCategories(@RequestParam Long userId) throws Exception {
        return categoryService.getAllCategoriesForUser(userId);
    }
    @GetMapping("/income-categories")
    @ResponseStatus(HttpStatus.OK)
    public List<CategoryResponse> getAllCategoriesForIncome(@RequestParam Long userId) throws Exception {
        return categoryService.getAllCategoriesForIncome(userId);
    }

    @GetMapping("/expense-categories")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @ResponseStatus(HttpStatus.OK)
    public List<CategoryResponse> getAllCategoriesForExpense(@RequestParam Long userId) throws Exception {
        return categoryService.getAllCategoriesForExpense(userId);
    }

    @PutMapping("/update-category/{categoryId}")
    @PreAuthorize("hasAuthority('category:update')")
    @ResponseStatus(HttpStatus.OK)
    public void updateCategory (@RequestBody CategoryUpdateRequest request, @RequestParam Long adminUserId, @PathVariable Long categoryId){
        categoryService.updateCategory(request,adminUserId,categoryId);

    }

//    @DeleteMapping("/delete-category/{categoryId}")
//    @PreAuthorize("hasAuthority('category:delete')")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void deleteCategory(@PathVariable Long categoryId, @RequestParam Long userId) {
//        categoryService.deleteCategory(categoryId, userId);
//    }


}

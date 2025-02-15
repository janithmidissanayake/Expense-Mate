package com.example.Jwt_Authentication.controller;

import com.example.Jwt_Authentication.Dto.*;
import com.example.Jwt_Authentication.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/income-controller")
@RequiredArgsConstructor
public class IncomeController  {
    private final IncomeService incomeService;

    @PostMapping("/createIncome")
    @ResponseStatus(HttpStatus.CREATED)
    public void addIncome(@RequestBody IncomeRequest request, @RequestParam Long userId) throws Exception {
        incomeService.addIncome(request,userId);
    }

    @GetMapping("/incomes")
    @ResponseStatus(HttpStatus.OK)
    public List<IncomeResponse> getAllIncomes(@RequestParam Long userId) throws Exception {
        return incomeService.getAllIncome(userId);
    }

    @PutMapping("/update-income/{incomeId}")
    @ResponseStatus(HttpStatus.OK)
    public UpdateIncomeResponse updateIncome (@RequestBody UpdateIncomeRequest request, @RequestParam Long userId, @PathVariable Long incomeId){
        return incomeService.updateIncome(incomeId,userId,request);

    }

    @DeleteMapping("/delete-income/{incomeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Return 204 No Content on successful deletion
    public void deleteIncome(@PathVariable Long incomeId, @RequestParam Long userId) {
        incomeService.deleteIncome(incomeId, userId);
    }
}

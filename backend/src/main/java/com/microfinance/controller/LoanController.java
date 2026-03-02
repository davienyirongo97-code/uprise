package com.microfinance.controller;

import com.microfinance.dto.LoanApplicationRequest;
import com.microfinance.dto.LoanApprovalRequest;
import com.microfinance.model.Loan;
import com.microfinance.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class LoanController {
    
    private final LoanService loanService;
    
    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }
    
    @PostMapping("/branch/loans")
    public ResponseEntity<Loan> applyForLoan(@RequestBody LoanApplicationRequest request, 
                                              Authentication auth) {
        return ResponseEntity.ok(loanService.applyForLoan(request, auth.getName()));
    }
    
    @GetMapping("/branch/loans")
    public ResponseEntity<List<Loan>> getBranchLoans(Authentication auth) {
        return ResponseEntity.ok(loanService.getBranchLoans(auth.getName()));
    }
    
    @GetMapping("/admin/loans/pending")
    public ResponseEntity<List<Loan>> getPendingLoans() {
        return ResponseEntity.ok(loanService.getPendingLoans());
    }
    
    @PostMapping("/admin/loans/{id}/approve")
    public ResponseEntity<Loan> approveLoan(@PathVariable Long id, 
                                            @RequestBody LoanApprovalRequest request,
                                            Authentication auth) {
        return ResponseEntity.ok(loanService.approveLoan(id, request, auth.getName()));
    }
    
    @PostMapping("/admin/loans/{id}/reject")
    public ResponseEntity<Loan> rejectLoan(@PathVariable Long id, 
                                           @RequestBody LoanApprovalRequest request,
                                           Authentication auth) {
        return ResponseEntity.ok(loanService.rejectLoan(id, request, auth.getName()));
    }
}

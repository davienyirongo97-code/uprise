package com.microfinance.service;

import com.microfinance.dto.LoanApplicationRequest;
import com.microfinance.dto.LoanApprovalRequest;
import com.microfinance.model.*;
import com.microfinance.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class LoanService {
    
    private final LoanRepository loanRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final InterestRateRepository interestRateRepository;
    
    public LoanService(LoanRepository loanRepository, ClientRepository clientRepository,
                       UserRepository userRepository, InterestRateRepository interestRateRepository) {
        this.loanRepository = loanRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.interestRateRepository = interestRateRepository;
    }
    
    @Transactional
    public Loan applyForLoan(LoanApplicationRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        InterestRate currentRate = interestRateRepository.findFirstByActiveTrueOrderByEffectiveFromDesc()
                .orElseThrow(() -> new RuntimeException("No active interest rate configured"));
        
        Loan loan = new Loan();
        loan.setLoanNumber("LN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        loan.setClient(client);
        loan.setBranch(user.getBranch());
        loan.setRequestedAmount(request.getRequestedAmount());
        loan.setRepaymentPeriodMonths(request.getRepaymentPeriodMonths());
        loan.setLoanPurpose(request.getLoanPurpose());
        loan.setInterestRate(currentRate.getRate());
        loan.setSubmittedBy(user);
        
        calculateLoanAmounts(loan);
        
        return loanRepository.save(loan);
    }
    
    private void calculateLoanAmounts(Loan loan) {
        BigDecimal principal = loan.getRequestedAmount();
        BigDecimal rate = loan.getInterestRate().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        Integer months = loan.getRepaymentPeriodMonths();
        
        BigDecimal interest = principal.multiply(rate).multiply(BigDecimal.valueOf(months))
                .divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        
        BigDecimal totalAmount = principal.add(interest);
        BigDecimal monthlyInstallment = totalAmount.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);
        
        loan.setTotalRepaymentAmount(totalAmount);
        loan.setMonthlyInstallment(monthlyInstallment);
        loan.setOutstandingBalance(totalAmount);
    }
    
    public List<Loan> getBranchLoans(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return loanRepository.findByBranchId(user.getBranch().getId());
    }
    
    public List<Loan> getPendingLoans() {
        return loanRepository.findByStatus(LoanStatus.PENDING);
    }
    
    @Transactional
    public Loan approveLoan(Long loanId, LoanApprovalRequest request, String username) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        loan.setStatus(LoanStatus.APPROVED);
        loan.setApprovedBy(admin);
        loan.setApprovedAt(LocalDateTime.now());
        
        if (request.getDisbursed()) {
            loan.setStatus(LoanStatus.ACTIVE);
            loan.setDisbursedAt(LocalDateTime.now());
        }
        
        return loanRepository.save(loan);
    }
    
    @Transactional
    public Loan rejectLoan(Long loanId, LoanApprovalRequest request, String username) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        loan.setStatus(LoanStatus.REJECTED);
        loan.setApprovedBy(admin);
        loan.setApprovedAt(LocalDateTime.now());
        loan.setRejectionReason(request.getReason());
        
        return loanRepository.save(loan);
    }
}

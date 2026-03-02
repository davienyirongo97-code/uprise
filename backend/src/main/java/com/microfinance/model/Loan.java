package com.microfinance.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Data
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String loanNumber;
    
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedAmount;
    
    @Column(nullable = false)
    private Integer repaymentPeriodMonths;
    
    @Column(nullable = false)
    private String loanPurpose;
    
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal totalRepaymentAmount;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal monthlyInstallment;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal amountPaid = BigDecimal.ZERO;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal outstandingBalance;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanStatus status = LoanStatus.PENDING;
    
    @ManyToOne
    @JoinColumn(name = "submitted_by")
    private User submittedBy;
    
    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    private LocalDateTime approvedAt;
    
    private LocalDateTime disbursedAt;
    
    private String rejectionReason;
}

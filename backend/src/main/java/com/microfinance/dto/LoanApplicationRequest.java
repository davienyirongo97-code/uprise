package com.microfinance.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LoanApplicationRequest {
    private Long clientId;
    private BigDecimal requestedAmount;
    private Integer repaymentPeriodMonths;
    private String loanPurpose;
}

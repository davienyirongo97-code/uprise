package com.microfinance.dto;

import lombok.Data;

@Data
public class LoanApprovalRequest {
    private Boolean disbursed = false;
    private String reason;
}

package com.microfinance.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ClientRegistrationRequest {
    private String fullName;
    private String nationalId;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String email;
    private String address;
}

package com.microfinance.controller;

import com.microfinance.dto.ClientRegistrationRequest;
import com.microfinance.model.Client;
import com.microfinance.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/branch/clients")
public class ClientController {
    
    private final ClientService clientService;
    
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }
    
    @PostMapping
    public ResponseEntity<Client> registerClient(@RequestBody ClientRegistrationRequest request,
                                                  Authentication auth) {
        return ResponseEntity.ok(clientService.registerClient(request, auth.getName()));
    }
    
    @PostMapping("/{id}/upload-id")
    public ResponseEntity<String> uploadNationalId(@PathVariable Long id,
                                                    @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(clientService.uploadNationalId(id, file));
    }
    
    @GetMapping
    public ResponseEntity<List<Client>> getBranchClients(Authentication auth) {
        return ResponseEntity.ok(clientService.getBranchClients(auth.getName()));
    }
}

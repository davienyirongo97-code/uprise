package com.microfinance.service;

import com.microfinance.dto.ClientRegistrationRequest;
import com.microfinance.model.Client;
import com.microfinance.model.User;
import com.microfinance.repository.ClientRepository;
import com.microfinance.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ClientService {
    
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    
    public ClientService(ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public Client registerClient(ClientRegistrationRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (clientRepository.findByNationalId(request.getNationalId()).isPresent()) {
            throw new RuntimeException("Client with this National ID already exists");
        }
        
        Client client = new Client();
        client.setFullName(request.getFullName());
        client.setNationalId(request.getNationalId());
        client.setDateOfBirth(request.getDateOfBirth());
        client.setPhoneNumber(request.getPhoneNumber());
        client.setEmail(request.getEmail());
        client.setAddress(request.getAddress());
        client.setBranch(user.getBranch());
        client.setRegisteredBy(user);
        
        return clientRepository.save(client);
    }
    
    public String uploadNationalId(Long clientId, MultipartFile file) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        try {
            String uploadDir = "./uploads/national-ids/";
            Files.createDirectories(Paths.get(uploadDir));
            
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + filename);
            Files.write(filePath, file.getBytes());
            
            client.setNationalIdImagePath(filePath.toString());
            clientRepository.save(client);
            
            return "File uploaded successfully";
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }
    
    public List<Client> getBranchClients(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return clientRepository.findByBranchId(user.getBranch().getId());
    }
}

package com.projectmatch.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) throws IOException {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot.resolve("formations"));
    }

    public String storeFormationPdf(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("PDF file is required");
        }

        String contentType = file.getContentType();
        String originalName = file.getOriginalFilename();
        boolean isPdf = (contentType != null && contentType.equals("application/pdf"))
                || (originalName != null && originalName.toLowerCase().endsWith(".pdf"));

        if (!isPdf) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        String storedName = UUID.randomUUID() + ".pdf";
        Path target = uploadRoot.resolve("formations").resolve(storedName);

        try {
            file.transferTo(target);
            return storedName;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store PDF file");
        }
    }

    public Path resolveFormationPdf(String fileName) {
        Path file = uploadRoot.resolve("formations").resolve(fileName).normalize();
        if (!file.startsWith(uploadRoot.resolve("formations"))) {
            throw new RuntimeException("Invalid file path");
        }
        if (!Files.exists(file)) {
            throw new RuntimeException("PDF file not found");
        }
        return file;
    }

    public void deleteFormationPdf(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return;
        }
        try {
            Files.deleteIfExists(uploadRoot.resolve("formations").resolve(fileName));
        } catch (IOException ex) {
            throw new RuntimeException("Failed to delete PDF file");
        }
    }
}

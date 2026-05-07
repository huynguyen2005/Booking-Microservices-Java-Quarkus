package com.booking.flightservice.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.ServiceUnavailableException;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class CloudinaryUploadService {

    private static final Logger LOG = Logger.getLogger(CloudinaryUploadService.class);

    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;

    public CloudinaryUploadService(
            @ConfigProperty(name = "cloudinary.cloud-name") Optional<String> cloudName,
            @ConfigProperty(name = "cloudinary.api-key") Optional<String> apiKey,
            @ConfigProperty(name = "cloudinary.api-secret") Optional<String> apiSecret) {
        this.cloudName = cloudName.orElse("");
        this.apiKey = apiKey.orElse("");
        this.apiSecret = apiSecret.orElse("");
    }

    public String uploadImage(byte[] bytes, String folder, String filename) {
        if (isBlank(cloudName) || isBlank(apiKey) || isBlank(apiSecret)) {
            LOG.error("Cloudinary env is missing: CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET");
            throw new ServiceUnavailableException("Cloudinary is not configured");
        }
        try {
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret
            ));
            Map<?, ?> result = cloudinary.uploader().upload(
                    bytes,
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image",
                            "public_id", sanitizeFilename(filename)
                    )
            );
            Object secureUrl = result.get("secure_url");
            if (secureUrl == null) {
                throw new IllegalStateException("secure_url missing from Cloudinary response");
            }
            return secureUrl.toString();
        } catch (Exception e) {
            LOG.error("Cloudinary upload failed", e);
            throw new ServiceUnavailableException("Image upload failed");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "image_" + System.currentTimeMillis();
        }
        return filename.replaceAll("[^a-zA-Z0-9-_\\.]", "_");
    }
}

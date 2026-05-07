package com.booking.userservice.resource;

import com.booking.userservice.dto.ImageUploadForm;
import com.booking.userservice.dto.ImageUploadResponse;
import com.booking.userservice.dto.UserResponse;
import com.booking.userservice.service.UserService;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Set;

@Path("/api/users/me")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class UserProfileResource {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private final UserService userService;
    private final JsonWebToken jwt;

    public UserProfileResource(UserService userService, JsonWebToken jwt) {
        this.userService = userService;
        this.jwt = jwt;
    }

    @POST
    @Path("/avatar")
    @RolesAllowed({"USER", "ADMIN"})
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public ImageUploadResponse uploadAvatar(ImageUploadForm form) {
        if (form == null || form.file == null) {
            throw new BadRequestException("file is required");
        }
        if (!ALLOWED_TYPES.contains(form.file.contentType())) {
            throw new BadRequestException("Unsupported file type");
        }
        if (form.file.size() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds 5MB");
        }
        try {
            byte[] bytes = Files.readAllBytes(form.file.uploadedFile());
            UserResponse updated = userService.uploadMyAvatar(jwt.getSubject(), bytes, form.file.fileName());
            return new ImageUploadResponse(updated.avatarUrl());
        } catch (IOException e) {
            throw new BadRequestException("Cannot read upload file");
        }
    }
}


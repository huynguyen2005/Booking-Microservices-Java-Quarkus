package com.booking.userservice.service;

import com.booking.userservice.dto.LoginRequest;
import com.booking.userservice.dto.LoginResponse;
import com.booking.userservice.dto.RegisterRequest;
import com.booking.userservice.dto.UpdateUserRequest;
import com.booking.userservice.dto.UserResponse;
import com.booking.userservice.dto.UserSummary;
import com.booking.userservice.entity.AppUser;
import com.booking.userservice.entity.Role;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.ArrayList;

@ApplicationScoped
public class UserService {

    private final PasswordHasher passwordHasher;
    private final JwtService jwtService;
    private final CloudinaryUploadService cloudinaryUploadService;

    public UserService(PasswordHasher passwordHasher, JwtService jwtService, CloudinaryUploadService cloudinaryUploadService) {
        this.passwordHasher = passwordHasher;
        this.jwtService = jwtService;
        this.cloudinaryUploadService = cloudinaryUploadService;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        validateRegisterRequest(request);
        if (AppUser.count("email", request.email()) > 0) {
            throw new WebApplicationException(Response.status(Response.Status.CONFLICT).entity("Email already exists").build());
        }
        AppUser user = new AppUser();
        user.fullName = request.fullName().trim();
        user.email = request.email().trim().toLowerCase();
        user.phone = normalizeOptional(request.phone());
        user.passwordHash = passwordHasher.hash(request.password());
        user.role = Role.USER;
        user.persist();
        return toResponse(user);
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null || isBlank(request.email()) || isBlank(request.password())) {
            throw new BadRequestException("Email and password are required");
        }
        AppUser user = AppUser.find("email", request.email().trim().toLowerCase()).firstResult();
        if (user == null || !passwordHasher.matches(request.password(), user.passwordHash)) {
            throw new NotAuthorizedException("Invalid credentials");
        }
        return new LoginResponse(jwtService.generateToken(user), toSummary(user));
    }

    public UserResponse me(String userId) {
        AppUser user = findByIdOrThrow(parseUserId(userId));
        return toResponse(user);
    }

    @Transactional
    public UserResponse uploadMyAvatar(String userId, byte[] fileBytes, String originalFilename) {
        AppUser user = findByIdOrThrow(parseUserId(userId));
        String imageUrl = cloudinaryUploadService.uploadImage(fileBytes, "users/avatar", originalFilename);
        user.avatarUrl = imageUrl;
        return toResponse(user);
    }

    public List<UserResponse> list() {
        return AppUser.listAll().stream().map(AppUser.class::cast).map(this::toResponse).toList();
    }

    public List<UserResponse> search(String keyword, Role role) {
        List<String> clauses = new ArrayList<>();
        List<Object> params = new ArrayList<>();
        if (keyword != null && !keyword.isBlank()) {
            String like = "%" + keyword.trim().toLowerCase() + "%";
            clauses.add("(lower(fullName) like ?" + (params.size() + 1) + " or lower(email) like ?" + (params.size() + 1) + " or lower(phone) like ?" + (params.size() + 1) + ")");
            params.add(like);
        }
        if (role != null) {
            clauses.add("role = ?" + (params.size() + 1));
            params.add(role);
        }
        List<AppUser> users = clauses.isEmpty()
                ? AppUser.listAll()
                : AppUser.find(String.join(" and ", clauses), params.toArray()).list();
        return users.stream().map(this::toResponse).toList();
    }

    public UserResponse get(Long id) {
        return toResponse(findByIdOrThrow(id));
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        AppUser user = findByIdOrThrow(id);
        if (request.email() != null && !request.email().isBlank()) {
            String normalizedEmail = request.email().trim().toLowerCase();
            AppUser existing = AppUser.find("email", normalizedEmail).firstResult();
            if (existing != null && !existing.id.equals(id)) {
                throw new WebApplicationException(Response.status(Response.Status.CONFLICT).entity("Email already exists").build());
            }
            user.email = normalizedEmail;
        }
        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.fullName = request.fullName().trim();
        }
        if (request.phone() != null) {
            user.phone = normalizeOptional(request.phone());
        }
        if (request.password() != null && !request.password().isBlank()) {
            user.passwordHash = passwordHasher.hash(request.password());
        }
        if (request.role() != null) {
            user.role = request.role();
        }
        return toResponse(user);
    }

    @Transactional
    public void delete(Long id) {
        AppUser user = findByIdOrThrow(id);
        user.delete();
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null || isBlank(request.fullName()) || isBlank(request.email()) || isBlank(request.password())) {
            throw new BadRequestException("fullName, email and password are required");
        }
    }

    private UserResponse toResponse(AppUser user) {
        return new UserResponse(user.id, user.fullName, user.email, user.phone, user.avatarUrl, user.role, user.createdAt);
    }

    private UserSummary toSummary(AppUser user) {
        return new UserSummary(user.id, user.fullName, user.email, user.role);
    }

    private AppUser findByIdOrThrow(Long id) {
        AppUser user = AppUser.findById(id);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    private Long parseUserId(String userId) {
        try {
            return Long.parseLong(userId);
        } catch (Exception e) {
            throw new NotAuthorizedException("Invalid token subject");
        }
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

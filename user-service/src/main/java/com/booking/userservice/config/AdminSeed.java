package com.booking.userservice.config;

import com.booking.userservice.entity.AppUser;
import com.booking.userservice.entity.Role;
import com.booking.userservice.service.PasswordHasher;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AdminSeed {

    private static final String ADMIN_EMAIL = "admin@gmail.com";

    private final PasswordHasher passwordHasher;

    public AdminSeed(PasswordHasher passwordHasher) {
        this.passwordHasher = passwordHasher;
    }

    @Transactional
    void onStart(@Observes StartupEvent event) {
        AppUser existing = AppUser.find("email", ADMIN_EMAIL).firstResult();
        if (existing != null) {
            return;
        }
        AppUser admin = new AppUser();
        admin.fullName = "System Admin";
        admin.email = ADMIN_EMAIL;
        admin.phone = "0900000000";
        admin.passwordHash = passwordHasher.hash("admin123");
        admin.role = Role.ADMIN;
        admin.persist();
    }
}


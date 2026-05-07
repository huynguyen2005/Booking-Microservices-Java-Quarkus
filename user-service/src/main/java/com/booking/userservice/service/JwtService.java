package com.booking.userservice.service;

import com.booking.userservice.entity.AppUser;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class JwtService {

    @ConfigProperty(name = "booking.jwt.issuer", defaultValue = "booking-microservices")
    String issuer;

    public String generateToken(AppUser user) {
        return Jwt.claims()
                .issuer(issuer)
                .subject(String.valueOf(user.id))
                .claim("userId", user.id)
                .claim("email", user.email)
                .claim("role", user.role.name())
                .groups(user.role.name())
                .sign();
    }
}

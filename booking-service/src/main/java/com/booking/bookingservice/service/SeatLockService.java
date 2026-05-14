package com.booking.bookingservice.service;

import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.keys.KeyCommands;
import io.quarkus.redis.datasource.value.ValueCommands;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.Duration;
import java.util.UUID;

@ApplicationScoped
public class SeatLockService {
    private static final Duration LOCK_TTL = Duration.ofSeconds(8);
    private static final String LOCK_PREFIX = "lock:seat:";

    private final ValueCommands<String, String> values;
    private final KeyCommands<String> keys;

    public SeatLockService(RedisDataSource redisDataSource) {
        this.values = redisDataSource.value(String.class);
        this.keys = redisDataSource.key();
    }

    public String acquire(Long flightId, String seatNumber) {
        String key = buildKey(flightId, seatNumber);
        String owner = UUID.randomUUID().toString();
        try {
            boolean acquired = values.setnx(key, owner);
            if (!acquired) {
                return null;
            }
            keys.expire(key, LOCK_TTL.toSeconds());
            return owner;
        } catch (Exception e) {
            return null;
        }
    }

    public void release(Long flightId, String seatNumber, String owner) {
        if (owner == null) {
            return;
        }
        String key = buildKey(flightId, seatNumber);
        try {
            String current = values.get(key);
            if (owner.equals(current)) {
                keys.del(key);
            }
        } catch (Exception ignored) {
        }
    }

    private String buildKey(Long flightId, String seatNumber) {
        return LOCK_PREFIX + flightId + ":" + seatNumber.trim().toUpperCase();
    }
}

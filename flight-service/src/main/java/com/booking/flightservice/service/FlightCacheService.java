package com.booking.flightservice.service;

import com.booking.flightservice.entity.Airplane;
import com.booking.flightservice.entity.Airport;
import com.booking.flightservice.entity.Flight;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.keys.KeyCommands;
import io.quarkus.redis.datasource.value.ValueCommands;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.Duration;
import java.util.List;
import java.util.function.Supplier;

@ApplicationScoped
public class FlightCacheService {

    private static final String AIRPORTS_KEY = "flight:airports:all";
    private static final String AIRPLANES_KEY = "flight:airplanes:all";
    private static final String FLIGHTS_KEY = "flight:flights:all";
    private static final String FLIGHT_KEY_PREFIX = "flight:flight:";
    private static final String SEAT_AVAIL_PREFIX = "flight:seat_avail:";

    private static final Duration AIRPORTS_TTL = Duration.ofMinutes(10);
    private static final Duration AIRPLANES_TTL = Duration.ofMinutes(10);
    private static final Duration FLIGHTS_TTL = Duration.ofSeconds(30);
    private static final Duration FLIGHT_TTL = Duration.ofSeconds(60);
    private static final Duration SEAT_AVAIL_TTL = Duration.ofSeconds(10);

    private final ValueCommands<String, String> values;
    private final KeyCommands<String> keys;
    private final ObjectMapper objectMapper;

    public FlightCacheService(RedisDataSource redisDataSource, ObjectMapper objectMapper) {
        this.values = redisDataSource.value(String.class);
        this.keys = redisDataSource.key();
        this.objectMapper = objectMapper;
    }

    public List<Airport> airports(Supplier<List<Airport>> supplier) {
        return readThroughList(AIRPORTS_KEY, AIRPORTS_TTL, new TypeReference<List<Airport>>() {}, supplier);
    }

    public List<Airplane> airplanes(Supplier<List<Airplane>> supplier) {
        return readThroughList(AIRPLANES_KEY, AIRPLANES_TTL, new TypeReference<List<Airplane>>() {}, supplier);
    }

    public List<Flight> flights(Supplier<List<Flight>> supplier) {
        return readThroughList(FLIGHTS_KEY, FLIGHTS_TTL, new TypeReference<List<Flight>>() {}, supplier);
    }

    public Flight flight(Long id, Supplier<Flight> supplier) {
        String key = FLIGHT_KEY_PREFIX + id;
        return readThroughValue(key, FLIGHT_TTL, Flight.class, supplier);
    }

    public boolean seatAvailability(Long flightId, String seatNumber, Supplier<Boolean> supplier) {
        String key = seatAvailabilityKey(flightId, seatNumber);
        return readThroughValue(key, SEAT_AVAIL_TTL, Boolean.class, supplier);
    }

    public void invalidateAirportCache() {
        safeDelete(AIRPORTS_KEY);
    }

    public void invalidateAirplaneCache() {
        safeDelete(AIRPLANES_KEY);
    }

    public void invalidateFlightCache(Long flightId) {
        safeDelete(FLIGHTS_KEY);
        if (flightId != null) {
            safeDelete(FLIGHT_KEY_PREFIX + flightId);
        }
    }

    public void invalidateSeatAvailability(Long flightId, String seatNumber) {
        if (flightId == null || seatNumber == null || seatNumber.isBlank()) {
            return;
        }
        safeDelete(seatAvailabilityKey(flightId, seatNumber));
    }

    private String seatAvailabilityKey(Long flightId, String seatNumber) {
        return SEAT_AVAIL_PREFIX + flightId + ":" + seatNumber.trim().toUpperCase();
    }

    private <T> T readThroughValue(String key, Duration ttl, Class<T> clazz, Supplier<T> supplier) {
        try {
            String cached = values.get(key);
            if (cached != null) {
                return objectMapper.readValue(cached, clazz);
            }
        } catch (Exception ignored) {
            // Fallback to DB when Redis is unavailable or payload is invalid.
        }

        T value = supplier.get();
        if (value == null) {
            return null;
        }
        try {
            values.setex(key, ttl.toSeconds(), objectMapper.writeValueAsString(value));
        } catch (Exception ignored) {
        }
        return value;
    }

    private <T> T readThroughList(String key, Duration ttl, TypeReference<T> typeReference, Supplier<T> supplier) {
        try {
            String cached = values.get(key);
            if (cached != null) {
                return objectMapper.readValue(cached, typeReference);
            }
        } catch (Exception ignored) {
            // Fallback to DB when Redis is unavailable or payload is invalid.
        }

        T value = supplier.get();
        if (value == null) {
            return null;
        }
        try {
            values.setex(key, ttl.toSeconds(), objectMapper.writeValueAsString(value));
        } catch (Exception ignored) {
        }
        return value;
    }

    private void safeDelete(String key) {
        try {
            keys.del(key);
        } catch (Exception ignored) {
        }
    }
}

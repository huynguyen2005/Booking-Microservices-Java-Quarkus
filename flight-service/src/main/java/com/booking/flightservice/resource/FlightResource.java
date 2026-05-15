package com.booking.flightservice.resource;

import com.booking.flightservice.dto.ImageUploadForm;
import com.booking.flightservice.dto.ImageUploadResponse;
import com.booking.flightservice.dto.FlightSearchResponse;
import com.booking.flightservice.entity.Airplane;
import com.booking.flightservice.entity.Airport;
import com.booking.flightservice.entity.Flight;
import com.booking.flightservice.entity.Seat;
import com.booking.flightservice.service.CloudinaryUploadService;
import com.booking.flightservice.service.FlightCacheService;
import com.booking.flightservice.service.FlightSearchService;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Locale;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class FlightResource {
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private final CloudinaryUploadService cloudinaryUploadService;
    private final FlightCacheService flightCacheService;
    private final FlightSearchService flightSearchService;
    private final SecurityIdentity securityIdentity;

    public FlightResource(
            CloudinaryUploadService cloudinaryUploadService,
            FlightCacheService flightCacheService,
            FlightSearchService flightSearchService,
            SecurityIdentity securityIdentity
    ) {
        this.cloudinaryUploadService = cloudinaryUploadService;
        this.flightCacheService = flightCacheService;
        this.flightSearchService = flightSearchService;
        this.securityIdentity = securityIdentity;
    }

    @GET
    @Path("/airports")
    @PermitAll
    public List<Airport> airports() {
        return flightCacheService.airports(() -> Airport.listAll());
    }

    @GET
    @Path("/airports/search")
    @PermitAll
    public List<Airport> searchAirports(@QueryParam("keyword") String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return Airport.listAll();
        }
        String like = "%" + keyword.trim().toLowerCase() + "%";
        return Airport.find("lower(code) like ?1 or lower(name) like ?1 or lower(city) like ?1", like).list();
    }

    @POST
    @Path("/airports")
    @RolesAllowed("ADMIN")
    @Transactional
    public Airport addAirport(Airport x) {
        x.persist();
        flightCacheService.invalidateAirportCache();
        return x;
    }

    @PUT
    @Path("/airports/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public Airport updateAirport(@PathParam("id") Long id, Airport input) {
        Airport airport = Airport.findById(id);
        if (airport == null) {
            throw new NotFoundException("Airport not found");
        }
        airport.code = input.code;
        airport.name = input.name;
        airport.city = input.city;
        flightCacheService.invalidateAirportCache();
        return airport;
    }

    @POST
    @Path("/airports/{id}/image")
    @RolesAllowed("ADMIN")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public ImageUploadResponse uploadAirportImage(@PathParam("id") Long id, ImageUploadForm form) {
        Airport airport = Airport.findById(id);
        if (airport == null) {
            throw new NotFoundException("Airport not found");
        }
        airport.imageUrl = uploadToCloudinary(form, "flight/airports");
        flightCacheService.invalidateAirportCache();
        return new ImageUploadResponse(airport.imageUrl);
    }

    @DELETE
    @Path("/airports/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public void deleteAirport(@PathParam("id") Long id) {
        Airport airport = Airport.findById(id);
        if (airport == null) {
            throw new NotFoundException("Airport not found");
        }
        airport.delete();
        flightCacheService.invalidateAirportCache();
    }

    @GET
    @Path("/airplanes")
    @PermitAll
    public List<Airplane> airplanes() {
        return flightCacheService.airplanes(() -> Airplane.listAll());
    }

    @GET
    @Path("/airplanes/search")
    @PermitAll
    public List<Airplane> searchAirplanes(@QueryParam("keyword") String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return Airplane.listAll();
        }
        String like = "%" + keyword.trim().toLowerCase() + "%";
        return Airplane.find("lower(code) like ?1 or lower(model) like ?1", like).list();
    }

    @POST
    @Path("/airplanes")
    @RolesAllowed("ADMIN")
    @Transactional
    public Airplane addAirplane(Airplane x) {
        x.persist();
        flightCacheService.invalidateAirplaneCache();
        return x;
    }

    @PUT
    @Path("/airplanes/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public Airplane updateAirplane(@PathParam("id") Long id, Airplane input) {
        Airplane airplane = Airplane.findById(id);
        if (airplane == null) {
            throw new NotFoundException("Airplane not found");
        }
        airplane.code = input.code;
        airplane.model = input.model;
        airplane.totalSeats = input.totalSeats;
        flightCacheService.invalidateAirplaneCache();
        return airplane;
    }

    @POST
    @Path("/airplanes/{id}/image")
    @RolesAllowed("ADMIN")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public ImageUploadResponse uploadAirplaneImage(@PathParam("id") Long id, ImageUploadForm form) {
        Airplane airplane = Airplane.findById(id);
        if (airplane == null) {
            throw new NotFoundException("Airplane not found");
        }
        airplane.imageUrl = uploadToCloudinary(form, "flight/airplanes");
        flightCacheService.invalidateAirplaneCache();
        return new ImageUploadResponse(airplane.imageUrl);
    }

    @DELETE
    @Path("/airplanes/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public void deleteAirplane(@PathParam("id") Long id) {
        Airplane airplane = Airplane.findById(id);
        if (airplane == null) {
            throw new NotFoundException("Airplane not found");
        }
        airplane.delete();
        flightCacheService.invalidateAirplaneCache();
    }

    @GET
    @Path("/flights")
    @PermitAll
    public List<Flight> flights() {
        return flightCacheService.flights(() -> Flight.listAll());
    }

    @GET
    @Path("/flights/{id}")
    @PermitAll
    public Flight flight(@PathParam("id") Long id) {
        return flightCacheService.flight(id, () -> Flight.findById(id));
    }

    @POST
    @Path("/flights")
    @RolesAllowed("ADMIN")
    @Transactional
    public Flight addFlight(Flight x) {
        if (x.basePrice == null || x.basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("basePrice must be >= 0");
        }
        x.currency = normalizeCurrency(x.currency);
        x.persist();
        flightCacheService.invalidateFlightCache(null);
        flightSearchService.indexFlight(x);
        return x;
    }

    @POST
    @Path("/flights/{id}/image")
    @RolesAllowed("ADMIN")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public ImageUploadResponse uploadFlightImage(@PathParam("id") Long id, ImageUploadForm form) {
        Flight flight = Flight.findById(id);
        if (flight == null) {
            throw new NotFoundException("Flight not found");
        }
        flight.imageUrl = uploadToCloudinary(form, "flight/flights");
        flightCacheService.invalidateFlightCache(id);
        return new ImageUploadResponse(flight.imageUrl);
    }

    @PUT
    @Path("/flights/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public Flight updateFlight(@PathParam("id") Long id, Flight input) {
        Flight flight = Flight.findById(id);
        if (flight == null) {
            throw new NotFoundException("Flight not found");
        }
        flight.flightNumber = input.flightNumber;
        flight.departureAirportId = input.departureAirportId;
        flight.arrivalAirportId = input.arrivalAirportId;
        flight.airplaneId = input.airplaneId;
        flight.departureTime = input.departureTime;
        flight.arrivalTime = input.arrivalTime;
        flight.status = input.status;
        if (input.basePrice == null || input.basePrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("basePrice must be >= 0");
        }
        flight.basePrice = input.basePrice;
        flight.currency = normalizeCurrency(input.currency);
        flightCacheService.invalidateFlightCache(id);
        flightSearchService.indexFlight(flight);
        return flight;
    }

    @DELETE
    @Path("/flights/{id}")
    @RolesAllowed("ADMIN")
    @Transactional
    public void deleteFlight(@PathParam("id") Long id) {
        Flight flight = Flight.findById(id);
        if (flight == null) {
            throw new NotFoundException("Flight not found");
        }
        flight.delete();
        flightCacheService.invalidateFlightCache(id);
        flightSearchService.deleteFlight(id);
    }

    @GET
    @Path("/flights/search")
    @PermitAll
    public FlightSearchResponse searchFlights(
            @QueryParam("keyword") String keyword,
            @QueryParam("departureAirportId") Long departureAirportId,
            @QueryParam("arrivalAirportId") Long arrivalAirportId,
            @QueryParam("airplaneId") Long airplaneId,
            @QueryParam("status") String status,
            @QueryParam("departureFrom") String departureFrom,
            @QueryParam("departureTo") String departureTo,
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sortBy") String sortBy,
            @QueryParam("sortDir") String sortDir
    ) {
        boolean isAdmin = securityIdentity != null && securityIdentity.hasRole("ADMIN");
        return flightSearchService.search(
                keyword,
                departureAirportId,
                arrivalAirportId,
                airplaneId,
                status,
                departureFrom,
                departureTo,
                page == null ? 0 : page,
                size == null ? 10 : size,
                sortBy,
                sortDir,
                isAdmin
        );
    }

    @GET
    @Path("/seats")
    @RolesAllowed({"USER", "ADMIN"})
    public List<Seat> seats(
            @QueryParam("flightId") Long flightId,
            @QueryParam("seatNumber") String seatNumber,
            @QueryParam("booked") Boolean booked
    ) {
        List<String> clauses = new ArrayList<>();
        List<Object> params = new ArrayList<>();
        if (flightId != null) {
            clauses.add("flightId = ?" + (params.size() + 1));
            params.add(flightId);
        }
        if (seatNumber != null && !seatNumber.isBlank()) {
            clauses.add("upper(seatNumber) like ?" + (params.size() + 1));
            params.add("%" + seatNumber.trim().toUpperCase() + "%");
        }
        if (booked != null) {
            if (booked) {
                clauses.add("upper(status) = ?" + (params.size() + 1));
                params.add("BOOKED");
            } else {
                clauses.add("upper(status) = ?" + (params.size() + 1));
                params.add("AVAILABLE");
            }
        }
        if (clauses.isEmpty()) {
            return Seat.listAll();
        }
        return Seat.find(String.join(" and ", clauses), params.toArray()).list();
    }

    @POST
    @Path("/seats")
    @RolesAllowed("ADMIN")
    @Transactional
    public Seat addSeat(Seat x) {
        if (x.status == null || x.status.isBlank()) {
            x.status = "AVAILABLE";
        } else {
            x.status = normalizeSeatStatus(x.status);
        }
        x.booked = "BOOKED".equals(x.status);
        x.persist();
        flightCacheService.invalidateSeatAvailability(x.flightId, x.seatNumber);
        return x;
    }

    @GET
    @Path("/seats/availability")
    @RolesAllowed({"USER", "ADMIN"})
    public boolean available(@QueryParam("flightId") Long flightId, @QueryParam("seatNumber") String seatNumber) {
        return flightCacheService.seatAvailability(flightId, seatNumber, () -> {
            Seat s = Seat.find("flightId=?1 and seatNumber=?2", flightId, seatNumber).firstResult();
            if (s == null) {
                return false;
            }
            if (s.status == null || s.status.isBlank()) {
                s.status = s.booked ? "BOOKED" : "AVAILABLE";
            }
            return "AVAILABLE".equalsIgnoreCase(s.status);
        });
    }

    @PUT
    @Path("/seats/{id}/book")
    @RolesAllowed("ADMIN")
    @Transactional
    public Seat book(@PathParam("id") Long id) {
        Seat s = Seat.findById(id);
        if (s != null) {
            s.status = "BOOKED";
            s.booked = true;
            flightCacheService.invalidateSeatAvailability(s.flightId, s.seatNumber);
        }
        return s;
    }

    @PUT
    @Path("/seats/hold")
    @PermitAll
    @Transactional
    public Seat holdSeat(@QueryParam("flightId") Long flightId, @QueryParam("seatNumber") String seatNumber) {
        Seat seat = findSeatOrThrow(flightId, seatNumber);
        String status = normalizeSeatStatus(seat.status);
        if (!"AVAILABLE".equals(status)) {
            throw new BadRequestException("Seat is not available");
        }
        seat.status = "HELD";
        seat.booked = false;
        flightCacheService.invalidateSeatAvailability(seat.flightId, seat.seatNumber);
        return seat;
    }

    @PUT
    @Path("/seats/confirm")
    @PermitAll
    @Transactional
    public Seat confirmSeat(@QueryParam("flightId") Long flightId, @QueryParam("seatNumber") String seatNumber) {
        Seat seat = findSeatOrThrow(flightId, seatNumber);
        String status = normalizeSeatStatus(seat.status);
        if ("BOOKED".equals(status)) {
            return seat;
        }
        if (!"HELD".equals(status)) {
            throw new BadRequestException("Seat is not held");
        }
        seat.status = "BOOKED";
        seat.booked = true;
        flightCacheService.invalidateSeatAvailability(seat.flightId, seat.seatNumber);
        return seat;
    }

    @PUT
    @Path("/seats/release")
    @PermitAll
    @Transactional
    public Seat releaseSeat(@QueryParam("flightId") Long flightId, @QueryParam("seatNumber") String seatNumber) {
        Seat seat = findSeatOrThrow(flightId, seatNumber);
        String status = normalizeSeatStatus(seat.status);
        if ("AVAILABLE".equals(status)) {
            return seat;
        }
        if ("BOOKED".equals(status)) {
            throw new BadRequestException("Booked seat cannot be released directly");
        }
        seat.status = "AVAILABLE";
        seat.booked = false;
        flightCacheService.invalidateSeatAvailability(seat.flightId, seat.seatNumber);
        return seat;
    }

    private Seat findSeatOrThrow(Long flightId, String seatNumber) {
        if (flightId == null || seatNumber == null || seatNumber.isBlank()) {
            throw new BadRequestException("flightId and seatNumber are required");
        }
        Seat seat = Seat.find("flightId=?1 and upper(seatNumber)=?2", flightId, seatNumber.trim().toUpperCase(Locale.ROOT)).firstResult();
        if (seat == null) {
            throw new NotFoundException("Seat not found");
        }
        if (seat.status == null || seat.status.isBlank()) {
            seat.status = seat.booked ? "BOOKED" : "AVAILABLE";
        }
        return seat;
    }

    private String normalizeSeatStatus(String status) {
        if (status == null || status.isBlank()) {
            return "AVAILABLE";
        }
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        if (!normalized.equals("AVAILABLE") && !normalized.equals("HELD") && !normalized.equals("BOOKED")) {
            throw new BadRequestException("Invalid seat status");
        }
        return normalized;
    }

    private String uploadToCloudinary(ImageUploadForm form, String folder) {
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
            return cloudinaryUploadService.uploadImage(bytes, folder, form.file.fileName());
        } catch (IOException e) {
            throw new BadRequestException("Cannot read upload file");
        }
    }

    private String normalizeCurrency(String currency) {
        if (currency == null || currency.isBlank()) {
            return "VND";
        }
        return currency.trim().toUpperCase(Locale.ROOT);
    }
}

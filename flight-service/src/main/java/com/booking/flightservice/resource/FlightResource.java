package com.booking.flightservice.resource;

import com.booking.flightservice.dto.ImageUploadForm;
import com.booking.flightservice.dto.ImageUploadResponse;
import com.booking.flightservice.entity.Airplane;
import com.booking.flightservice.entity.Airport;
import com.booking.flightservice.entity.Flight;
import com.booking.flightservice.entity.Seat;
import com.booking.flightservice.service.CloudinaryUploadService;
import io.quarkus.security.Authenticated;
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
import java.nio.file.Files;
import java.util.List;
import java.util.Set;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class FlightResource {
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private final CloudinaryUploadService cloudinaryUploadService;

    public FlightResource(CloudinaryUploadService cloudinaryUploadService) {
        this.cloudinaryUploadService = cloudinaryUploadService;
    }

    @GET @Path("/airports") @PermitAll public List<Airport> airports(){ return Airport.listAll(); }
    @POST @Path("/airports") @RolesAllowed("ADMIN") @Transactional public Airport addAirport(Airport x){ x.persist(); return x; }
    @PUT @Path("/airports/{id}") @RolesAllowed("ADMIN") @Transactional
    public Airport updateAirport(@PathParam("id") Long id, Airport input) {
        Airport airport = Airport.findById(id);
        if (airport == null) {
            throw new NotFoundException("Airport not found");
        }
        airport.code = input.code;
        airport.name = input.name;
        airport.city = input.city;
        return airport;
    }
    @POST @Path("/airports/{id}/image") @RolesAllowed("ADMIN") @Consumes(MediaType.MULTIPART_FORM_DATA) @Transactional
    public ImageUploadResponse uploadAirportImage(@PathParam("id") Long id, ImageUploadForm form) {
        Airport airport = Airport.findById(id);
        if (airport == null) {
            throw new NotFoundException("Airport not found");
        }
        airport.imageUrl = uploadToCloudinary(form, "flight/airports");
        return new ImageUploadResponse(airport.imageUrl);
    }
    @DELETE @Path("/airports/{id}") @RolesAllowed("ADMIN") @Transactional
    public void deleteAirport(@PathParam("id") Long id) {
        Airport airport = Airport.findById(id);
        if (airport == null) {
            throw new NotFoundException("Airport not found");
        }
        airport.delete();
    }
    @GET @Path("/airplanes") @RolesAllowed({"USER", "ADMIN"}) public List<Airplane> airplanes(){ return Airplane.listAll(); }
    @POST @Path("/airplanes") @RolesAllowed("ADMIN") @Transactional public Airplane addAirplane(Airplane x){ x.persist(); return x; }
    @PUT @Path("/airplanes/{id}") @RolesAllowed("ADMIN") @Transactional
    public Airplane updateAirplane(@PathParam("id") Long id, Airplane input) {
        Airplane airplane = Airplane.findById(id);
        if (airplane == null) {
            throw new NotFoundException("Airplane not found");
        }
        airplane.code = input.code;
        airplane.model = input.model;
        airplane.totalSeats = input.totalSeats;
        return airplane;
    }
    @POST @Path("/airplanes/{id}/image") @RolesAllowed("ADMIN") @Consumes(MediaType.MULTIPART_FORM_DATA) @Transactional
    public ImageUploadResponse uploadAirplaneImage(@PathParam("id") Long id, ImageUploadForm form) {
        Airplane airplane = Airplane.findById(id);
        if (airplane == null) {
            throw new NotFoundException("Airplane not found");
        }
        airplane.imageUrl = uploadToCloudinary(form, "flight/airplanes");
        return new ImageUploadResponse(airplane.imageUrl);
    }
    @DELETE @Path("/airplanes/{id}") @RolesAllowed("ADMIN") @Transactional
    public void deleteAirplane(@PathParam("id") Long id) {
        Airplane airplane = Airplane.findById(id);
        if (airplane == null) {
            throw new NotFoundException("Airplane not found");
        }
        airplane.delete();
    }
    @GET @Path("/flights") @PermitAll public List<Flight> flights(){ return Flight.listAll(); }
    @GET @Path("/flights/{id}") @PermitAll public Flight flight(@PathParam("id") Long id){ return Flight.findById(id); }
    @POST @Path("/flights") @RolesAllowed("ADMIN") @Transactional public Flight addFlight(Flight x){ x.persist(); return x; }
    @POST @Path("/flights/{id}/image") @RolesAllowed("ADMIN") @Consumes(MediaType.MULTIPART_FORM_DATA) @Transactional
    public ImageUploadResponse uploadFlightImage(@PathParam("id") Long id, ImageUploadForm form) {
        Flight flight = Flight.findById(id);
        if (flight == null) {
            throw new NotFoundException("Flight not found");
        }
        flight.imageUrl = uploadToCloudinary(form, "flight/flights");
        return new ImageUploadResponse(flight.imageUrl);
    }
    @PUT @Path("/flights/{id}") @RolesAllowed("ADMIN") @Transactional
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
        return flight;
    }
    @DELETE @Path("/flights/{id}") @RolesAllowed("ADMIN") @Transactional
    public void deleteFlight(@PathParam("id") Long id) {
        Flight flight = Flight.findById(id);
        if (flight == null) {
            throw new NotFoundException("Flight not found");
        }
        flight.delete();
    }
    @GET @Path("/seats") @RolesAllowed({"USER", "ADMIN"}) public List<Seat> seats(@QueryParam("flightId") Long flightId){ return flightId==null?Seat.listAll():Seat.list("flightId",flightId); }
    @POST @Path("/seats") @RolesAllowed("ADMIN") @Transactional public Seat addSeat(Seat x){ x.persist(); return x; }
    @GET @Path("/seats/availability") @RolesAllowed({"USER", "ADMIN"})
    public boolean available(@QueryParam("flightId") Long flightId,@QueryParam("seatNumber") String seatNumber){
        Seat s=Seat.find("flightId=?1 and seatNumber=?2",flightId,seatNumber).firstResult();
        return s!=null && !s.booked;
    }
    @PUT @Path("/seats/{id}/book") @RolesAllowed("ADMIN") @Transactional public Seat book(@PathParam("id") Long id){ Seat s=Seat.findById(id); if(s!=null)s.booked=true; return s; }

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
}

package com.booking.flightservice.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.DeleteResponse;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.JsonData;
import com.booking.flightservice.dto.FlightSearchResponse;
import com.booking.flightservice.entity.Flight;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.ws.rs.BadRequestException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class FlightSearchService {
    private static final String INDEX_NAME = "flights";
    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_SIZE = 100;

    private final ElasticsearchClient elasticsearchClient;

    public FlightSearchService(ElasticsearchClient elasticsearchClient) {
        this.elasticsearchClient = elasticsearchClient;
    }

    void onStart(@Observes io.quarkus.runtime.StartupEvent event) {
        try {
            recreateIndexAndSync();
        } catch (Exception e) {
            Log.error("Elasticsearch startup sync failed", e);
        }
    }

    public FlightSearchResponse search(
            String keyword,
            Long departureAirportId,
            Long arrivalAirportId,
            Long airplaneId,
            String status,
            String departureFrom,
            String departureTo,
            int page,
            int size,
            String sortBy,
            String sortDir,
            boolean adminMode
    ) {
        int safePage = Math.max(DEFAULT_PAGE, page);
        int safeSize = size <= 0 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
        String resolvedSortBy = resolveSortBy(sortBy);
        SortOrder order = "desc".equalsIgnoreCase(sortDir) ? SortOrder.Desc : SortOrder.Asc;

        List<Query> mustQueries = new ArrayList<>();
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            String kwLower = kw.toLowerCase();
            mustQueries.add(Query.of(q -> q.bool(b -> b
                    .should(s -> s.multiMatch(m -> m
                            .query(kw)
                            .fields("flightNumber")
                    ))
                    .should(s -> s.prefix(p -> p
                            .field("flightNumber.keyword")
                            .value(kwUpper(kw))
                    ))
                    .should(s -> s.wildcard(w -> w
                            .field("flightNumber.keyword")
                            .value("*" + kwUpper(kw) + "*")
                    ))
                    .should(s -> s.prefix(p -> p
                            .field("flightNumber.keyword")
                            .value(kwLower)
                    ))
                    .should(s -> s.wildcard(w -> w
                            .field("flightNumber.keyword")
                            .value("*" + kwLower + "*")
                    ))
                    .minimumShouldMatch("1")
            )));
        }
        if (departureAirportId != null) {
            mustQueries.add(Query.of(q -> q.term(t -> t.field("departureAirportId").value(departureAirportId))));
        }
        if (arrivalAirportId != null) {
            mustQueries.add(Query.of(q -> q.term(t -> t.field("arrivalAirportId").value(arrivalAirportId))));
        }
        if (airplaneId != null) {
            mustQueries.add(Query.of(q -> q.term(t -> t.field("airplaneId").value(airplaneId))));
        }
        if (status != null && !status.trim().isEmpty()) {
            mustQueries.add(Query.of(q -> q.term(t -> t.field("status").value(status.trim().toUpperCase()))));
        } else if (!adminMode) {
            mustQueries.add(Query.of(q -> q.term(t -> t.field("status").value("SCHEDULED"))));
        }
        if ((departureFrom != null && !departureFrom.trim().isEmpty()) || (departureTo != null && !departureTo.trim().isEmpty())) {
            mustQueries.add(Query.of(q -> q.range(r -> r.untyped(u -> {
                u.field("departureTime");
                if (departureFrom != null && !departureFrom.trim().isEmpty()) {
                    u.gte(JsonData.of(departureFrom.trim()));
                }
                if (departureTo != null && !departureTo.trim().isEmpty()) {
                    u.lte(JsonData.of(departureTo.trim()));
                }
                return u;
            }))));
        }

        Query finalQuery = mustQueries.isEmpty()
                ? Query.of(q -> q.matchAll(m -> m))
                : Query.of(q -> q.bool(b -> b.must(mustQueries)));

        try {
            SearchResponse<FlightIndexDoc> response = elasticsearchClient.search(s -> s
                            .index(INDEX_NAME)
                            .query(finalQuery)
                            .from(safePage * safeSize)
                            .size(safeSize)
                            .sort(so -> so.field(f -> f.field(resolvedSortBy).order(order))),
                    FlightIndexDoc.class
            );
            List<Flight> items = new ArrayList<>();
            for (Hit<FlightIndexDoc> hit : response.hits().hits()) {
                FlightIndexDoc doc = hit.source();
                if (doc != null) {
                    items.add(doc.toEntity());
                }
            }
            long total = response.hits().total() == null ? items.size() : response.hits().total().value();
            int totalPages = (int) Math.ceil((double) total / safeSize);
            return new FlightSearchResponse(items, safePage, safeSize, total, totalPages);
        } catch (IOException e) {
            throw new RuntimeException("Search failed", e);
        }
    }

    public void indexFlight(Flight flight) {
        if (flight == null || flight.id == null) {
            return;
        }
        try {
            ensureIndex();
            IndexResponse ignored = elasticsearchClient.index(i -> i
                    .index(INDEX_NAME)
                    .id(String.valueOf(flight.id))
                    .document(FlightIndexDoc.fromEntity(flight))
            );
        } catch (IOException e) {
            Log.errorf(e, "Index flight failed for id=%s", flight.id);
        }
    }

    public void deleteFlight(Long id) {
        if (id == null) {
            return;
        }
        try {
            DeleteResponse ignored = elasticsearchClient.delete(d -> d.index(INDEX_NAME).id(String.valueOf(id)));
        } catch (IOException e) {
            Log.errorf(e, "Delete flight index failed for id=%s", id);
        }
    }

    private void recreateIndexAndSync() throws IOException {
        if (elasticsearchClient.indices().exists(e -> e.index(INDEX_NAME)).value()) {
            elasticsearchClient.indices().delete(d -> d.index(INDEX_NAME));
        }
        ensureIndex();
        syncAllFromDatabase();
    }

    private void syncAllFromDatabase() {
        List<Flight> flights = Flight.listAll();
        for (Flight flight : flights) {
            indexFlight(flight);
        }
        Log.infov("Synced {0} flights into Elasticsearch", flights.size());
    }

    private void ensureIndex() throws IOException {
        boolean exists = elasticsearchClient.indices().exists(e -> e.index(INDEX_NAME)).value();
        if (exists) {
            return;
        }
        elasticsearchClient.indices().create(c -> c
                .index(INDEX_NAME)
                .mappings(m -> m
                        .properties("id", p -> p.long_(l -> l))
                        .properties("departureAirportId", p -> p.long_(l -> l))
                        .properties("arrivalAirportId", p -> p.long_(l -> l))
                        .properties("airplaneId", p -> p.long_(l -> l))
                        .properties("flightNumber", p -> p.text(t -> t
                                .fields("keyword", f -> f.keyword(k -> k))
                        ))
                        .properties("departureTime", p -> p.keyword(k -> k))
                        .properties("arrivalTime", p -> p.keyword(k -> k))
                        .properties("status", p -> p.keyword(k -> k))
                        .properties("imageUrl", p -> p.keyword(k -> k))
                ));
    }

    private String kwUpper(String text) {
        return text == null ? "" : text.toUpperCase();
    }

    private String resolveSortBy(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return "departureTime";
        }
        return switch (sortBy) {
            case "id", "departureAirportId", "arrivalAirportId", "airplaneId", "flightNumber", "departureTime", "arrivalTime", "status" ->
                    sortBy;
            default -> throw new BadRequestException("Invalid sortBy");
        };
    }

    public static class FlightIndexDoc {
        public Long id;
        public Long departureAirportId;
        public Long arrivalAirportId;
        public Long airplaneId;
        public String flightNumber;
        public String departureTime;
        public String arrivalTime;
        public String status;
        public String imageUrl;

        public static FlightIndexDoc fromEntity(Flight flight) {
            FlightIndexDoc doc = new FlightIndexDoc();
            doc.id = flight.id;
            doc.departureAirportId = flight.departureAirportId;
            doc.arrivalAirportId = flight.arrivalAirportId;
            doc.airplaneId = flight.airplaneId;
            doc.flightNumber = flight.flightNumber;
            doc.departureTime = flight.departureTime;
            doc.arrivalTime = flight.arrivalTime;
            doc.status = flight.status == null ? null : flight.status.toUpperCase();
            doc.imageUrl = flight.imageUrl;
            return doc;
        }

        public Flight toEntity() {
            Flight flight = new Flight();
            flight.id = this.id;
            flight.departureAirportId = this.departureAirportId;
            flight.arrivalAirportId = this.arrivalAirportId;
            flight.airplaneId = this.airplaneId;
            flight.flightNumber = this.flightNumber;
            flight.departureTime = this.departureTime;
            flight.arrivalTime = this.arrivalTime;
            flight.status = this.status;
            flight.imageUrl = this.imageUrl;
            return flight;
        }
    }
}

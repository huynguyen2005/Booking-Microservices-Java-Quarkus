package com.booking.apigateway.resource;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
@PreMatching
public class DebugFilter implements ContainerRequestFilter {
    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String origin = requestContext.getHeaderString("Origin");
        String method = requestContext.getMethod();
        String path = requestContext.getUriInfo().getPath();
        System.out.println("[gateway-debug] method=" + method + " path=" + path + " origin=" + origin);
    }
}

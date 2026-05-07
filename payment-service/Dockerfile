FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY . .
RUN mvn -pl payment-service -am clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/payment-service/target/quarkus-app/ /app/
EXPOSE 8084
ENTRYPOINT ["java","-jar","/app/quarkus-run.jar"]

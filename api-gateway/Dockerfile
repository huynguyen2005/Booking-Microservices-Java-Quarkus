FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY . .
RUN mvn -pl api-gateway -am clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/api-gateway/target/quarkus-app/ /app/
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/quarkus-run.jar"]

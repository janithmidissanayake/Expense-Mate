# Use a multi-stage build for efficiency
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and configuration files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies to speed up builds
RUN ./mvnw dependency:resolve

# Copy the source code and build the application
COPY src ./src
RUN ./mvnw package -DskipTests

# Create a lightweight runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]

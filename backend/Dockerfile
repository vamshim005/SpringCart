FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"] 
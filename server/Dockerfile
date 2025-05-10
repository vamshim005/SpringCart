# Use an official Maven image to build the app
FROM maven:3.9.6-eclipse-temurin-11 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Use an official OpenJDK image to run the app
FROM eclipse-temurin:11-jre
WORKDIR /app
RUN apt-get update && apt-get install -y default-mysql-client
COPY --from=build /app/target/*.jar app.jar
COPY wait-for-mysql.sh /app/wait-for-mysql.sh
RUN chmod +x /app/wait-for-mysql.sh
EXPOSE 8080 
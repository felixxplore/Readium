FROM eclipse-temurin:17-jre-alpine

EXPOSE 8080

COPY target/bms-0.0.1-SNAPSHOT.jar app.jar

WORKDIR /app

ENTRYPOINT ["java", "-jar", "bms-0.0.1-SNAPSHOT.jar"]
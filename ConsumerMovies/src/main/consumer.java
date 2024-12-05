import java.sql.*;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

public class KafkaConsumer {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/mi_base_de_datos";
    private static final String DB_USER = "usuario";
    private static final String DB_PASSWORD = "usuario_password";


    public static void main(String[] args) {
        // Configuración de Kafka
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:29092");
        props.put("group.id", "test-group");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // Suscripción al tema
        consumer.subscribe(Collections.singletonList("user-location-updates"));

        System.out.println("Consumer is running...");

        try {
            while (true) {
                // Recupera los mensajes
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
                for (ConsumerRecord<String, String> record : records) {
                    System.out.println("test");
                    System.out.println("Value: " + record.value());
                }
            }
        } catch (Exception e) {
            System.err.println("Error while running Kafka consumer: " + e.getMessage());
        } finally {
            consumer.close();
        }
    }
    }

    public static void insertarUsuario(Connection connection, String nombre, String correo, String padres) throws SQLException {
    String query = "INSERT INTO usuarios (nombre, correo, padres) VALUES (?, ?, ?)";
    try (PreparedStatement stmt = connection.prepareStatement(query)) {
        stmt.setString(1, nombre);
        stmt.setString(2, correo);
        stmt.setString(3, padres);
        int rows = stmt.executeUpdate();
        System.out.println("Usuario insertado: " + rows + " fila(s) afectada(s).");
    }

    // Método para insertar una película
    public static void insertarPelicula(Connection connection, String nombre) throws SQLException {
        String query = "INSERT INTO peliculas (nombre) VALUES (?)";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setString(1, nombre);
            int rows = stmt.executeUpdate();
            System.out.println("Película insertada: " + rows + " fila(s) afectada(s).");
        }
    }

    // Método para insertar una relación usuario-película
    public static void insertarUsuarioPelicula(Connection connection, int idUsuario, int idPelicula) throws SQLException {
        String query = "INSERT INTO usuarios_peliculas (id_usuario, id_pelicula) VALUES (?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, idUsuario);
            stmt.setInt(2, idPelicula);
            int rows = stmt.executeUpdate();
            System.out.println("Relación usuario-película insertada: " + rows + " fila(s) afectada(s).");
        }
    }

    // Método para seleccionar usuarios y mostrar su información
    public static void seleccionarUsuarios(Connection connection) throws SQLException {
        String query = "SELECT * FROM usuarios";
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            System.out.println("Usuarios en la base de datos:");
            while (rs.next()) {
                int id = rs.getInt("id_usuario");
                String nombre = rs.getString("nombre");
                String correo = rs.getString("correo");
                String padres = rs.getString("padres");
                System.out.printf("ID: %d, Nombre: %s, Correo: %s, Padres: %s%n", id, nombre, correo, padres);
            }
        }
    }
}

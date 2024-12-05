CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    padres VARCHAR(200)
);

CREATE TABLE peliculas (
    id_pelicula INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL
);

CREATE TABLE usuarios_peliculas (
    id_usuario INT,
    id_pelicula INT,
    PRIMARY KEY (id_usuario, id_pelicula),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_pelicula) REFERENCES peliculas(id_pelicula)
);
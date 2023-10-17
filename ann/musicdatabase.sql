CREATE DATABASE music;
USE music;

CREATE TABLE artists(
    artistid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE users(
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE 
);

CREATE TABLE albums(
    albumid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE songs(
    songid INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    artistid INT NOT NULL,
    albumid INT NOT NULL,
    durationSeconds DECIMAL(6,2),
    lyrics TEXT,

    FOREIGN KEY (artistid) REFERENCES artists(artistid),
    FOREIGN KEY (albumid) REFERENCES albums(albumid)
);

CREATE TABLE playlists (
    playlistid INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    name VARCHAR(50) NOT NULL,

    FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE TABLE playlist_songs (
    playlist_song_id INT AUTO_INCREMENT PRIMARY KEY,
    playlistid INT NOT NULL,
    songid INT NOT NULL,

    FOREIGN KEY (playlistid) REFERENCES playlists(playlistid),
    FOREIGN KEY (songid) REFERENCES songs(songid)
);


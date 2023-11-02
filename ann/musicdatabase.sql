CREATE TABLE artists(
    artistid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users(
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE 
);

CREATE TABLE albums(
    albumid INT AUTO_INCREMENT PRIMARY KEY,
    artistid INT,
    name VARCHAR(50) NOT NULL,

    KEY artistid_idx (artistid)
);

CREATE TABLE songs(
    songid INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    artistid INT NOT NULL,
    albumid INT NOT NULL,
    durationSeconds DECIMAL(6,2),
    lyrics TEXT,

    KEY artistid_idx (artistid),
    KEY albumid_idx (albumid)
);

CREATE TABLE playlists (
    playlistid INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    name VARCHAR(50) NOT NULL,

    KEY userid_idx (userid)
);

CREATE TABLE playlist_songs (
    playlistid INT NOT NULL,
    songid INT NOT NULL,

    PRIMARY KEY(playlistid, songid),
    KEY playlistid_idx (playlistid),
    KEY songid_idx (songid)
);


export interface Song {
    title: string;
    durationSeconds: number;
}

export interface Artist {
    name: string
}

export interface Album {
    name: string
}

export interface SongArtistAlbum {
    song: Song;
    artist: Artist;
    album: Album;
}
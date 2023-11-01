// song search api endpoint

import { Song, Artist, Album, SongArtistAlbum } from "../../interfaces/songArtistAlbum";

interface RequestData {
    searchTerm: string;
}

export async function POST(req: Request) {
    const { searchTerm } = await req.json() as RequestData;

    const spotifyEndpoint = 'https://api.spotify.com/v1';
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    try {
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        let data = await tokenResponse.json();
        const accessToken = data.access_token;

        const query: string = encodeURIComponent(searchTerm);
        const response = await fetch(spotifyEndpoint + '/search?q=' + query + "&type=track&limit=10", {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        })

        data = await response.json();
;
        if(data.length === 0) {
            return Response.json({
                status: 408,
                error: 'No search results'
            })
        }

        let songArtistAlbumArr: SongArtistAlbum[] = [];

        data.tracks.items.forEach((track: any) => {
            const song: Song = {title: track.name, durationSeconds: (track.duration_ms / 1000)};
            const album: Album = {name: track.album.name};
            const artist: Artist = {name: track.artists[0].name};
            const songArtistAlbum: SongArtistAlbum = {song: song, artist: artist, album: album};

            songArtistAlbumArr.push(songArtistAlbum)      
        })

        return Response.json({
            status: 207,
            SongArtistAlbumArr: songArtistAlbumArr
        });
    }
    catch(error) {
        return Response.json({
            status: 500,
            error: "Internal server error"
        });
    }
}
export function lyricsParser(rows: { lyrics: string | null }[]) {
let index = 0;
    for(let i = 0; i < rows.length; i++) {
        if(rows[i].lyrics != null) {
            index = i;
        }
    }

    return rows[index].lyrics;
}
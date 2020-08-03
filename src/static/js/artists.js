let playing = null;

function song(song_id) {
    let track = document.getElementById(`track_${song_id}`);

    if (playing !== null && playing !== song_id) {
        let track2 = document.getElementById(`track_${playing}`);
        $(`.song_button_${playing}`).html('<i class="fas fa-play"></i>');
        try {
            track2.pause();
            track2.currentTime = 0;
        } catch (e) {}
        playing = null;
    }
    if (track.paused) {
        $(`.song_button_${song_id}`).html('<i class="fas fa-pause"></i>');
        playing = song_id;
        try {
            track.play();
            track.volume = 0.1;
        } catch (e) {}
    } else {
        $(`.song_button_${song_id}`).html('<i class="fas fa-play"></i>');
        playing = null;
        try {
            track.pause();
            track.currentTime = 0;
        } catch (e) {}
    }

    track.onended = function() {
        $(`.song_button_${song_id}`).html('<i class="fas fa-play"></i>');
    };
}
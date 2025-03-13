import { audio } from '@app/state/audio/audio'
import { $playingTrack } from '@app/state/tracks/playingTrack'
import { effect } from '@monstermann/signals'

effect(() => {
    const track = $playingTrack()

    if (!track) {
        audio.title = ''
        navigator.mediaSession.metadata = null
        return
    }

    audio.title = [track.title, track.artist, track.album]
        .filter(Boolean)
        .join(' — ')

    navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
    })
})

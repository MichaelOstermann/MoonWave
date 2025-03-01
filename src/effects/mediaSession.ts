import { audio } from '@app/state/audio'
import { $playingTrackId } from '@app/state/playingTrackId'
import { $tracksById } from '@app/state/tracksById'
import { effect } from '@app/utils/signals/effect'

effect(() => {
    const trackId = $playingTrackId()
    const track = $tracksById(trackId)()

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

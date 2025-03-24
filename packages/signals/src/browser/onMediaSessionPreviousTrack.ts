import { event } from '../event'

export const onMediaSessionPreviousTrack = event<MediaSessionActionDetails>()
navigator.mediaSession.setActionHandler('previoustrack', onMediaSessionPreviousTrack)

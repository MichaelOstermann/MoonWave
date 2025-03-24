import { event } from '../event'

export const onMediaSessionNextTrack = event<MediaSessionActionDetails>()
navigator.mediaSession.setActionHandler('nexttrack', onMediaSessionNextTrack)

import { event } from '../event'

export const onMediaSessionPlay = event<MediaSessionActionDetails>()
navigator.mediaSession.setActionHandler('play', onMediaSessionPlay)

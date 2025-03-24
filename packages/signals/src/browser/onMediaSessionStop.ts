import { event } from '../event'

export const onMediaSessionStop = event<MediaSessionActionDetails>()
navigator.mediaSession.setActionHandler('stop', onMediaSessionStop)

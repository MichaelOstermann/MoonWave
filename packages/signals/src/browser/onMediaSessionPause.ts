import { event } from '../event'

export const onMediaSessionPause = event<MediaSessionActionDetails>()
navigator.mediaSession.setActionHandler('pause', onMediaSessionPause)

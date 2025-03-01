import { indexSignalBy } from '@app/utils/signals/indexSignalBy'
import { $playlists } from './playlists'

export const $playlistsById = indexSignalBy($playlists, p => p.id)

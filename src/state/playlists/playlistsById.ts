import { indexSignalBy } from '@monstermann/signals'
import { $playlists } from './playlists'

export const $playlistsById = indexSignalBy($playlists, p => p.id)

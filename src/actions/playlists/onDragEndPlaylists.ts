import { easeInOut } from '@app/config/easings'
import { $draggingPlaylistIds } from '@app/state/playlists/draggingPlaylistIds'
import { $dropPlaylistId } from '@app/state/playlists/dropPlaylistId'
import { $dropPlaylistSide } from '@app/state/playlists/dropPlaylistSide'
import { $playlists } from '@app/state/playlists/playlists'
import { $playlistTree } from '@app/state/playlists/playlistTree'
import { findAllAndMap } from '@app/utils/data/findAllAndMap'
import { merge } from '@app/utils/data/merge'
import { pipe } from '@app/utils/data/pipe'
import { autoAnimate } from '@app/utils/dom/autoAnimate'
import { closeEmptyPlaylists } from '@app/utils/playlist/closeEmptyPlaylists'
import { collectPlaylistIds } from '@app/utils/playlist/collectPlaylistIds'
import { collectPlaylists } from '@app/utils/playlist/collectPlaylists'
import { getPlaylistParentIds } from '@app/utils/playlist/getPlaylistParentIds'
import { action } from '@monstermann/signals'
import { match } from 'ts-pattern'

export const onDragEndPlaylists = action(async () => {
    const targetId = $dropPlaylistId()
    const tree = $playlistTree()
    const forbiddenPlaylistIds = $draggingPlaylistIds()
        .flatMap(pid => collectPlaylistIds(pid, tree))

    // Prevent playlists from being dropped into one of their descendants.
    if (!targetId || forbiddenPlaylistIds.includes(targetId)) {
        $draggingPlaylistIds.set([])
        return
    }

    const side = $dropPlaylistSide()
    const playlists = $playlists()
    const draggingIds = playlists
        // Collect the dragging ids in order of occurence.
        .filter(p => $draggingPlaylistIds().includes(p.id))
        .map(p => p.id)
        // Collect the roots by dropping descendants.
        .filter((pid, _, pids) => {
            const parentIds = getPlaylistParentIds(pid, tree)
            return !parentIds.some(parentId => pids.includes(parentId))
        })

    const playlistsToMove = draggingIds.flatMap(id => collectPlaylists(id, tree))
    const playlistIdsToMove = playlistsToMove.map(p => p.id)
    const otherPlaylists = playlists.filter(p => !playlistsToMove.includes(p))

    autoAnimate({
        target: document.querySelector('.sidebar .playlists'),
        filter: element => element.hasAttribute('data-playlist-id'),
        movedElementsHint: playlistIdsToMove.map(id => document.querySelector(`[data-playlist-id="${id}"]`)!),
    })

    if (side === 'inside') {
        document.querySelector(`[data-playlist-id="${targetId}"]`)?.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(.96)' },
            { transform: 'scale(1)' },
        ], { duration: 400, easing: easeInOut })
    }

    const targetPlaylist = otherPlaylists.find(p => p.id === targetId)!
    const targetIdx = otherPlaylists.indexOf(targetPlaylist)

    const newParentId = match(side)
        .with('inside', () => targetId)
        .with('below', () => targetPlaylist.parentId)
        .with('above', () => targetPlaylist.parentId)
        .exhaustive()

    const offset = match(side)
        .with('inside', () => targetIdx + 1)
        .with('below', () => targetIdx + 1)
        .with('above', () => targetIdx)
        .exhaustive()

    const newPlaylists = pipe(
        otherPlaylists,
        ps => ps.toSpliced(offset, 0, ...playlistsToMove),
        // Reparent roots.
        ps => findAllAndMap(
            ps,
            p => draggingIds.includes(p.id),
            p => merge(p, { parentId: newParentId }),
        ),
        ps => closeEmptyPlaylists(ps),
    )

    $playlists.set(newPlaylists)
    $draggingPlaylistIds.set([])
})

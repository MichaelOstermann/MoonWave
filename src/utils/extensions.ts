export const extensions = /\.(?:wav|bwf|raw|aiff|flac|m4a|pac|tta|wv|ast|aac|mp2|mp3|mp4|amr|s3m|3gp|act|au|dct|dss|gsm|m4p|mmf|mpc|ogg|oga|opus|ra|sln|vox)$/i

export function isAudioPath(path: string): boolean {
    return extensions.test(path)
}

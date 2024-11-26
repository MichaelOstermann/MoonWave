mkdir -p src-tauri/bin

curl -O https://www.osxexperts.net/ffmpeg71arm.zip
unzip ffmpeg71arm.zip
mv -f ffmpeg src-tauri/bin/ffmpeg-aarch64-apple-darwin

rm -rf __MACOSX
rm -f ffmpeg71arm.zip

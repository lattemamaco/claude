#!/bin/sh
# finish.sh <project> <version>   e.g. finish.sh ~/reel-edits/my-reel v1
# After `HF render -o renders/<slug>-<version>.mp4`: normalizes loudness to Instagram level, writes a 1080p copy small
# enough to send in chat (<30 MB), and a frame sheet of the caption band from the FINAL file (5 fps, first 12 s) to
# prove only one caption word shows at a time.
set -e
proj=$1; ver=$2
cd "$proj/renders"
src=$(ls -t *-"$ver".mp4 | head -1)
base=${src%.mp4}
ffmpeg -loglevel error -y -i "$src" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$base-full.mp4"
ffmpeg -loglevel error -y -i "$base-full.mp4" -c:v libx264 -crf 21 -preset slow -maxrate 4M -bufsize 8M -c:a copy -movflags +faststart "$base-post.mp4"
ffmpeg -loglevel error -y -t 12 -i "$base-post.mp4" -vf "fps=5,crop=1080:420:0:1050,scale=270:-2,tile=10x6" -frames:v 1 "../work/$base-words.jpg"
ffmpeg -hide_banner -i "$base-post.mp4" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
ls -la "$base-post.mp4"
echo "check ../work/$base-words.jpg: one word per frame, no stacked words"

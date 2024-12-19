virtual@force:~$ yt-dlp -F "https://www.youtube.com/live/gCNeDWCI0vo"
[youtube] Extracting URL: https://www.youtube.com/live/gCNeDWCI0vo
[youtube] gCNeDWCI0vo: Downloading webpage
[youtube] gCNeDWCI0vo: Downloading ios player API JSON
[youtube] gCNeDWCI0vo: Downloading android player API JSON
[youtube] gCNeDWCI0vo: Downloading m3u8 information
[youtube] gCNeDWCI0vo: Downloading m3u8 information
[info] Available formats for gCNeDWCI0vo:
ID  EXT RESOLUTION FPS │   TBR PROTO │ VCODEC        VBR ACODEC     MORE INFO
─────────────────────────────────────────────────────────────────────────────
233 mp4 audio only     │       m3u8  │ audio only        unknown    Default
234 mp4 audio only     │       m3u8  │ audio only        unknown    Default
269 mp4 256x144     15 │  290k m3u8  │ avc1.42C00B  290k video only
91  mp4 256x144     15 │  290k m3u8  │ avc1.42c00b       mp4a.40.5
229 mp4 426x240     30 │  546k m3u8  │ avc1.4D4015  546k video only
92  mp4 426x240     30 │  546k m3u8  │ avc1.4d4015       mp4a.40.5
230 mp4 640x360     30 │ 1210k m3u8  │ avc1.4D401E 1210k video only
93  mp4 640x360     30 │ 1210k m3u8  │ avc1.4d401e       mp4a.40.2
231 mp4 854x480     30 │ 1569k m3u8  │ avc1.4D401F 1569k video only
94  mp4 854x480     30 │ 1569k m3u8  │ avc1.4d401f       mp4a.40.2
232 mp4 1280x720    30 │ 2969k m3u8  │ avc1.4D401F 2969k video only
95  mp4 1280x720    30 │ 2969k m3u8  │ avc1.4d401f       mp4a.40.2
270 mp4 1920x1080   30 │ 5421k m3u8  │ avc1.640028 5421k video only
96  mp4 1920x1080   30 │ 5421k m3u8  │ avc1.640028       mp4a.40.2

virtual@force:~$ yt-dlp -f 233 --hls-use-mpegts -o audio.mp4 "https://www.youtube.com/live/gCNeDWCI0vo"

virtual@force:~$ ffplay audio.mp4

virtual@force:~$ ffmpeg -i audio.mp4 -vn -c:a copy audio.aac

virtual@force:~$ ffplay audio.aac

# activate virtual environment

virtual@force:~$ whisper audio.aac --model base




---
name: rooted-reel
description: "Ally's (@rootedwithally) personal reel edit style, built on top of /video-edit. Bold yellow hook title with a handwritten kicker, one-word serif captions with only the key words in yellow, cute pink handwritten notes that pop in for a few seconds on the main points, a warm grade, and slow push-ins only on the important moments. Trigger with /rooted-reel or 'edit this in my style', 'make a reel in my style', 'use my reel style'."
---

# /rooted-reel

Ally's locked reel style. It runs the /video-edit pipeline for the cut and swaps the look for this one. Everything
below came from her notes on her first reel; do not re-litigate it.

`VE` is the video-edit skill folder (`~/.claude/skills/video-edit` or `.claude/skills/video-edit` in this repo),
`RR` is this folder. Read `VE/SKILL.md` first: setup, "This machine", hard rules and steps 1-4 all apply.

## The style (exact values live in `RR/template/build.py`)
- **Grade:** warm "cool girl" grade (`sepia(.18) saturate(.9) contrast(.93) brightness(1.05) hue-rotate(-5deg)`),
  warm soft-light overlay, soft vignette. No film grain, no cutout, no reels orbiting her (only if she asks).
- **Hook (first ~6-9s):** a small white handwritten kicker (Patrick Hand 60px) above a two-line Title Case title in
  Poppins 800, 100px, yellow `#FCE15A`. Top band, above her head (y 236-520). Leaves at the cut `HOOK_END`.
- **Captions:** Tinos (Times-style serif), white, 84px, ONE word at a time, centred on the chest band (top 1150).
  Only the words that carry the point are highlighted: yellow + bold, 96px (`KEY`, about 1 word in 10).
- **Notes (main points):** Gochi Hand 76px, soft pink `#FFB8CC`, slight tilt, top band (top 250). Each bounces in
  ~0.1s after a cut, holds about 3 seconds, then pops away while she keeps talking. Soft pop sound. 3-4 per reel.
  Short phrases that name the point ("the hard parts...", "both can be true"), never a repeat of the caption.
- **Camera:** ONE steady framing for the whole reel (every EDL segment `zoom: 1.0`). She found zoom switches at
  every cut glitchy. Slow push-ins (scale 1 -> 1.07-1.12, sine ease) ONLY on the important moments in `PUSH`:
  the hook, the core confession line, the takeaway, the closing line. No cut punches.
- **Audio:** loudness normalized to -14 LUFS (she records quietly). Subtle SFX: whoosh + pop on the title, a soft
  pop per note.

## Workflow
1. Steps 0-4 of `VE/SKILL.md` (setup, intake, ingest, pick takes, assemble, transcribe_cut). In the EDL every
   segment is `"zoom": 1.0, "cx": 0.5, "cy": 0.5`. Skip `cutout.py` and `headpos.py` (this style has no
   behind-head words). Open on her strongest line; cut long pauses, stumbles and filler intros.
2. Copy `RR/template/build.py`, `RR/template/assets/gsap.min.js` and `RR/template/assets/fonts/` into the project
   (`assets/fonts/`, `assets/gsap.min.js`), plus `VE/assets/template/hyperframes.json`, `package.json` and
   `assets/sfx/` (pop.mp3, whoosh-short.mp3).
3. Rewrite only the CONTENT block of build.py: `FIX`, `DROP`, `KEY`, `HOOK_KICK`, `HOOK_TITLE`, `HOOK_END`,
   `NOTES`, `PUSH`. Post the plan (hook title, notes, key words, push-in moments) to Ally in plain words and keep going.
4. `HF lint` (0 errors), `PY build.py --safe`, `HF snapshot --at <10-15 moments> --no-end --describe false`. Check:
   title and notes stay above her head, captions never cover her mouth or chin, nothing in the red safe zone.
5. `PY build.py` (no `--safe`), `HF render -o renders/<slug>-vN.mp4 --quality high`, then
   `sh RR/scripts/finish.sh <project> vN`. Look at the word sheet it prints: one word per frame.
6. Send `renders/<slug>-vN-post.mp4` (1080p, under 30 MB). Remind her to turn off silent mode to hear it.

## Background swap (only when Ally asks for one)
- Use her own room photo when she has one (real photos look natural; AI rooms looked fake). Frame it so any window
  sits on the side her light comes from, just out of frame, never behind her.
- Cut her out with Robust Video Matting, NOT `VE/scripts/cutout.py`: the per-frame cutout dropped her fingers and
  flickered on every gesture. `PY -m pip install onnxruntime`, download `rvm_resnet50_fp32.onnx` from
  github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/ , then
  `PY RR/scripts/rvm_matte.py assets/aroll.mp4 segments.json <model> assets/alpha_rvm.mp4` (~0.25 s/frame on CPU).
  Merge with ffmpeg: `[0:v]<light curves>,format=yuva420p[c];[1:v]format=gray,erosion,gblur=sigma=0.8[m];[c][m]alphamerge`
  into a VP9 WebM with alpha, then layer it over the photo (`#bgimg` with `blur(5px)`).
- Do NOT render the cutout through HyperFrames: decoding the big alpha WebM in Chrome ran out of memory at 99%.
  Render only the captions as a transparent layer (copy index.html to `caps/`, strip the bg image, cutout video and
  audio, set html/body/#root background transparent, `HF render --format webm --low-memory-mode`), then stack it all
  with ffmpeg: blurred photo, `[s]overlay` the cutout (decode with `-c:v libvpx-vp9`), overlay captions, `-map` voice.wav.
- Strong sun on her face: soften it with `curves=all='0/0.03 0.3/0.33 0.5/0.52 0.85/0.80 1/0.9',eq=saturation=0.95`.
- Voice: `aresample=async=1:first_pts=0` first (the cut's audio has small gaps), then highpass 80, afftdn, presence EQ,
  compressor, loudnorm -14, into assets/voice.wav, used as the composition's audio.

## Traps already hit once
- Two words a few hundredths of a second apart ("I don't"): the hide fired before the pop-in finished and a word
  stuck on screen. The template gives every word at least 0.18s (`MIN_ON`). Snapshots seek and miss this: only
  frames from the final render prove it (finish.sh).
- A render stores every frame on disk first (~250 MB per second of reel at 1080x1920). Past ~60 seconds that fills
  the cloud disk and can restart the machine. Render long reels with `--low-memory-mode` (streams frames, one worker).
- iPhone clips are stored landscape with a rotation tag. `VE/scripts/assemble.py` in this repo handles it.
- Cloud sessions: cdn.jsdelivr.net and Google Fonts are blocked, which is why GSAP and the fonts ship in this
  folder. Clips from Google Drive need drive.google.com and drive.usercontent.google.com allowed and the file set to
  "Anyone with the link". Whisper needs huggingface.co and *.hf.co. Chat attachments cap at 30 MB.

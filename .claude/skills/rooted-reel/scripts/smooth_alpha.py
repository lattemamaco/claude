"""smooth_alpha.py <alpha.mp4> <segments.json> <out.mp4>
Steadies a matte over time so hair edges stop shimmering: each pixel takes a 7-frame weighted average of its
neighbours inside the same shot, but only where the change is small (flicker). Big changes (real motion such as
hands) keep the current frame, so nothing ghosts. Shots never mix across a cut."""
import json, subprocess, sys
import numpy as np
src, segs, out = sys.argv[1:4]
W, H, R, TOL = 1080, 1920, 3, 0.30
WTS = np.array([1, 2, 3, 4, 3, 2, 1], np.float32)
seg_of, k = [], 0
S = json.load(open(segs))
for i, s in enumerate(S):
    seg_of += [i] * s['frames']
dec = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                        '-c:v', 'libx264', '-pix_fmt', 'gray', '-crf', '10', '-preset', 'fast', out], stdin=subprocess.PIPE)
frames = []
while True:
    b = dec.stdout.read(W * H)
    if len(b) < W * H: break
    frames.append(b)          # keep compressed bytes only: 2 MB per frame
n = len(frames)
get = lambda i: np.frombuffer(frames[i], np.uint8).astype(np.float32) / 255
for t in range(n):
    cur = get(t)
    acc, wsum = np.zeros_like(cur), 0.0
    for d, w in zip(range(-R, R + 1), WTS):
        j = t + d
        if 0 <= j < n and j < len(seg_of) and seg_of[j] == seg_of[min(t, len(seg_of) - 1)]:
            acc += w * (cur if d == 0 else get(j)); wsum += w
    avg = acc / wsum
    res = np.where(np.abs(avg - cur) < TOL, avg, cur)
    enc.stdin.write((np.clip(res, 0, 1) * 255 + .5).astype(np.uint8).tobytes())
    if t % 300 == 0: print('frame', t, flush=True)
enc.stdin.close(); enc.wait()
print('done', n)

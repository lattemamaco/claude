"""rvm_matte.py <aroll.mp4> <segments.json> <model.onnx> <out_alpha.mp4> [max_frames]
Robust Video Matting alpha for a talking-head cut: temporally stable (recurrent), state reset at every cut."""
import json, subprocess, sys, time
import numpy as np, onnxruntime as ort
src, segs, model, out = sys.argv[1:5]
maxf = int(sys.argv[5]) if len(sys.argv) > 5 else None
W, H = 1080, 1920
cuts = {s['frame'] for s in json.load(open(segs)) if s['frame']}
so = ort.SessionOptions(); so.intra_op_num_threads = 4
sess = ort.InferenceSession(model, so, providers=['CPUExecutionProvider'])
dec = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{W}x{H}', '-r', '30',
                        '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'gray', '-crf', '10', '-preset', 'fast', out], stdin=subprocess.PIPE)
zero = np.zeros([1, 1, 1, 1], np.float32)
rec = [zero] * 4
dr = np.array([0.25], np.float32)
n, t0 = 0, time.time()
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3 or (maxf and n >= maxf):
        break
    if n in cuts:
        rec = [zero] * 4          # new shot: start the recurrent state fresh
    x = np.frombuffer(buf, np.uint8).reshape(H, W, 3).transpose(2, 0, 1)[None].astype(np.float32) / 255
    fgr, pha, *rec = sess.run(None, {'src': x, 'r1i': rec[0], 'r2i': rec[1], 'r3i': rec[2], 'r4i': rec[3], 'downsample_ratio': dr})
    enc.stdin.write((np.clip(pha[0, 0], 0, 1) * 255).astype(np.uint8).tobytes())
    n += 1
    if n % 150 == 0:
        print(f'frame {n}  {(time.time() - t0) / n:.2f}s/frame', flush=True)
enc.stdin.close(); enc.wait(); dec.kill()
print(f'done {n} frames  {(time.time() - t0) / max(n, 1):.2f}s/frame')

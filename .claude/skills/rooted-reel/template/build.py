#!/usr/bin/env python3
"""rooted-reel template: Ally's (@rootedwithally) reel style. Copy into a /video-edit project after assemble.py and
transcribe_cut.py, rewrite the CONTENT block for the new reel, keep everything else.

Style (locked with Ally on her first reel, see SKILL.md):
  grade    warm "cool girl" grade + soft vignette
  hook     Patrick Hand kicker + Poppins 800 yellow title in the top band, until HOOK_END
  words    Tinos serif, white, ONE word at a time on the chest band; KEY words yellow + bold
  notes    Gochi Hand, soft pink, tilted, bounce in for ~3s then pop away (soft pop sound)
  camera   one steady framing; slow push-ins ONLY on the moments in PUSH (no zoom switch at every cut)

PY build.py          writes index.html
PY build.py --safe   same + red Instagram safe-zone guide (snapshots only)
"""
import json
import os
import shutil
import subprocess
import sys

SAFE = '--safe' in sys.argv or bool(os.environ.get('SAFE'))
DUR = float(subprocess.run([shutil.which('ffprobe') or 'ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                            'stream=duration', '-of', 'csv=p=0', 'assets/aroll.mp4'],
                           capture_output=True, encoding='utf-8', errors='replace').stdout.strip().split(',')[0])
with open('segments.json', encoding='utf-8') as _f:
    SEGS = json.load(_f)
CUTS = [s['frame'] / 30 - .002 for s in SEGS if s['frame']]
with open('words.json', encoding='utf-8') as _f:
    W = json.load(_f)

GIRL_F = 'sepia(.18) saturate(.9) contrast(.93) brightness(1.05) hue-rotate(-5deg)'

SEGT = {s['id']: s['frame'] / 30 - .002 for s in SEGS}   # segment id -> cut time in the reel
YEL = '#FCE15A'
PINK = '#FFB8CC'

# ============================== CONTENT: rewrite for every reel (example values from reel 1) ==============================
# word indices refer to words.json (transcribe_cut.py). Print them with:
#   python3 -c "import json;w=json.load(open('words.json'));print(' '.join(f'{i}:{x[\"text\"]}' for i,x in enumerate(w)))"
FIX = {6: 'anything.', 31: 'wrong,', 116: 'motherhood,', 136: 'human.'}   # caption text fixes: what she actually said
DROP = {135, 137}                                   # Whisper extras to leave out of the captions
KEY = {3, 11, 16, 21, 88, 95, 103, 106, 116, 122, 128, 133, 136}   # ONLY the words that carry the point (~1 in 10)

HOOK_KICK = 'an honest mom moment'                  # small handwritten line above the title
HOOK_TITLE = ["I Don't Always", 'Love Motherhood']  # two short lines, Title Case, each fits 1010px at 100px Poppins 800
HOOK_END = 'thought'                                # segment id where the title leaves (end of the hook, ~6-9s in)

NOTES = [  # (segment id, seconds on screen, text): main points, pop up ~0.1s after that cut, never the same words as the line
    ('constant', 2.8, 'the hard parts...'),
    ('years', 3.0, 'what 7 years taught me'),
    ('youcan', 3.0, 'both can be true'),
    ('human', 2.8, 'say it out loud'),
]

PUSH = [  # (segment id, next segment id or None for the end, end scale): slow push-in on the important moments only
    ('hook', 'love', 1.07), ('love', 'enjoy', 1.09), ('youcan', 'human', 1.09), ('human', None, 1.12),
]

LOW_SEGS = []   # (from id, to id): shots where the face sits low, so captions drop under the chin (rarely needed)
# ==========================================================================================================================

T_HOOK_END = SEGT[HOOK_END]
NOTES = [(SEGT[k] + .1, d, text) for k, d, text in NOTES]


def captions():
    """one word at a time, centred on the chest band"""
    html, tw = [], []
    idx = [i for i in range(len(W)) if i not in DROP]
    # each word owns the screen for at least MIN_ON, so its pop-in always finishes before it is hidden
    # (v2 bug: "I don't" 0.02s apart -> the hide fired before the pop-in ended and "I" stuck on screen)
    MIN_ON = .18
    on = []
    for i in idx:
        a = max(0.0, W[i]['start'] - .03)
        if on:
            a = max(a, on[-1] + MIN_ON)
        on.append(a)
    for n, i in enumerate(idx):
        a = on[n]
        nxt = on[n + 1] if n + 1 < len(idx) else DUR
        end = min(nxt, max(W[i]['end'] + .35, a + MIN_ON), DUR)
        wid = f'w{i}'
        low = ' low' if any(SEGT[k] <= a + .03 < SEGT[nk] for k, nk in LOW_SEGS) else ''
        key = ' key' if i in KEY else ''
        html.append(f'<div id="{wid}" class="word{low}{key}">{FIX.get(i, W[i]["text"])}</div>')
        tw.append(f"gsap.set('#{wid}',{{autoAlpha:0}});")
        tw.append(f"tl.fromTo('#{wid}',{{autoAlpha:0,scale:.86,y:10}},{{autoAlpha:1,scale:1,y:0,duration:.12,ease:'back.out(2)',immediateRender:false}},{a:.3f});")
        if end < DUR - .01:
            tw.append(f"tl.set('#{wid}',{{autoAlpha:0}},{end:.3f});")
    return html, tw


def hand(hid, text, cls, style, t, b):
    chars = ''.join(f'<span class="hc">{"&nbsp;" if c == " " else c}</span>' for c in text)
    html = [f'<div id="{hid}" class="{cls}" style="{style}">{chars}</div>']
    tw = [f"gsap.set('#{hid}',{{autoAlpha:0}});", f"tl.set('#{hid}',{{autoAlpha:1}},{t:.3f});",
          f"tl.fromTo('#{hid} .hc',{{autoAlpha:0,y:6}},{{autoAlpha:1,y:0,duration:.12,stagger:.028,ease:'power1.out',immediateRender:false}},{t:.3f});"]
    if b < DUR - .01:
        tw += [f"tl.to('#{hid}',{{autoAlpha:0,duration:.16}},{b - .16:.3f});", f"tl.set('#{hid}',{{autoAlpha:0}},{b:.3f});"]
    return html, tw


def hook():
    html, tw = hand('kick', HOOK_KICK, 'hand kick', 'top:236px', .05, T_HOOK_END)
    lines = ''.join(f'<div class="tl">{l}</div>' for l in HOOK_TITLE)
    html.append(f'<div id="title" class="title">{lines}</div>')
    tw += ["gsap.set('#title',{autoAlpha:0});",
           "tl.fromTo('#title .tl',{autoAlpha:0,scale:.82,filter:'blur(14px)'},{autoAlpha:1,scale:1,filter:'blur(0px)',duration:.4,stagger:.16,ease:'back.out(1.7)',immediateRender:false},.35);",
           "tl.set('#title',{autoAlpha:1},.35);",
           f"tl.to('#title',{{autoAlpha:0,y:-20,duration:.2,ease:'power2.in'}},{T_HOOK_END - .2:.3f});",
           f"tl.set('#title',{{autoAlpha:0}},{T_HOOK_END:.3f});"]
    return html, tw


def notes():
    """cute marker-style notes (Gochi Hand, soft pink, slight tilt) that bounce in and pop away"""
    html, tw = [], []
    for k, (t, d, text) in enumerate(NOTES):
        nid, rot = f'note{k}', (-4, 3, -3, 4)[k % 4]
        chars = ''.join(f'<span class="hc">{"&nbsp;" if c == " " else c}</span>' for c in text)
        html.append(f'<div id="{nid}" class="note"><div class="ni">{chars}</div></div>')
        tw += [f"gsap.set('#{nid}',{{autoAlpha:0}});",
               f"gsap.set('#{nid} .ni',{{rotation:{rot}}});",
               f"tl.set('#{nid}',{{autoAlpha:1}},{t:.3f});",
               f"tl.fromTo('#{nid} .ni',{{scale:0,y:30}},{{scale:1,y:0,duration:.45,ease:'back.out(2.4)',immediateRender:false}},{t:.3f});",
               f"tl.fromTo('#{nid} .hc',{{autoAlpha:0}},{{autoAlpha:1,duration:.06,stagger:.022,immediateRender:false}},{t + .05:.3f});",
               f"tl.to('#{nid} .ni',{{scale:1.06,duration:.5,yoyo:true,repeat:1,ease:'sine.inOut'}},{t + .6:.3f});",
               f"tl.to('#{nid} .ni',{{scale:.4,y:-20,autoAlpha:0,duration:.22,ease:'back.in(2)'}},{t + d - .22:.3f});",
               f"tl.set('#{nid}',{{autoAlpha:0}},{t + d:.3f});"]
    return html, tw


def grades():
    tw = [f"gsap.set('.g',{{filter:'{GIRL_F}'}});"]
    for k, nk, z in PUSH:
        a = SEGT[k] if SEGT[k] > 0 else 0.0
        b = SEGT[nk] if nk else DUR
        tw.append(f"tl.fromTo('#stage',{{scale:1}},{{scale:{z},duration:{b - a:.3f},ease:'sine.inOut',immediateRender:false}},{a:.3f});")
        if nk:
            tw.append(f"tl.set('#stage',{{scale:1}},{b:.3f});")   # lands on the cut, so the reset is invisible
    tw.append("tl.fromTo('#root',{filter:'blur(14px) brightness(1.25)'},{filter:'blur(0px) brightness(1)',duration:.5,ease:'power3.out',immediateRender:false},0);")
    tw.append("tl.set('#root',{filter:'none'},.52);")
    return tw


SFX = [('whoosh-short', .3, .22), ('pop', .52, .14)] + [('pop', t, .1) for t, _, _ in NOTES]
SFX_LEN = {'whoosh-short': .57, 'pop': .72}
SFX_GAIN = 0.75


def audio():
    out, lanes = [], []
    for k, (name, t, vol) in enumerate(sorted(SFX, key=lambda x: x[1])):
        d = min(SFX_LEN[name], DUR - t)
        lane = next((i for i, end in enumerate(lanes) if end <= t), None)
        if lane is None:
            lanes.append(0); lane = len(lanes) - 1
        lanes[lane] = t + d
        out.append(f'<audio id="sfx{k}" src="assets/sfx/{name}.mp3" data-start="{t:.3f}" data-duration="{d:.3f}" '
                   f'data-track-index="{10 + lane}" data-volume="{vol * SFX_GAIN:.3f}"></audio>')
    return out


CSS = f'''
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden;background:#000}}
#root{{position:relative;width:1080px;height:1920px;overflow:hidden;background:#000}}
#stage{{position:absolute;inset:0;transform-origin:50% 38%}}
.full{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.fx{{position:absolute;inset:0;pointer-events:none}}
#gwarm{{z-index:7;background:linear-gradient(180deg,rgba(255,226,200,.10),rgba(255,196,170,.16));mix-blend-mode:soft-light}}
#gvig{{z-index:7;background:radial-gradient(120% 70% at 50% 45%,rgba(255,255,255,0) 52%,rgba(60,35,25,.34) 100%)}}
#ggrad{{z-index:7;background:linear-gradient(180deg,rgba(60,35,25,.30) 0%,rgba(60,35,25,0) 30%,rgba(60,35,25,0) 52%,rgba(40,24,18,.55) 100%)}}
/* hook: handwritten kicker + heavy yellow title in the top band, above her head */
.hand{{position:absolute;left:40px;right:110px;z-index:8;text-align:center;color:#fff;font-family:'Patrick Hand';
  letter-spacing:.04em;text-shadow:0 2px 14px rgba(0,0,0,.55),0 1px 3px rgba(0,0,0,.4);white-space:nowrap}}
.hand .hc{{display:inline-block}}
.kick{{font-size:60px;left:40px;right:40px}}
.note{{position:absolute;left:40px;right:110px;top:250px;z-index:8;text-align:center}}
.note .ni{{display:inline-block;font-family:'Gochi Hand';font-size:76px;color:{PINK};white-space:nowrap;letter-spacing:.01em;
  text-shadow:0 0 1px #6b2c3e,0 3px 0 rgba(107,44,62,.55),0 6px 22px rgba(0,0,0,.45)}}
.note .hc{{display:inline-block}}
.title{{position:absolute;left:35px;right:35px;top:312px;z-index:8;text-align:center;color:{YEL};font-family:Poppins;font-weight:800;
  font-size:100px;line-height:1.0;letter-spacing:-.01em;text-shadow:0 6px 28px rgba(0,0,0,.35),0 2px 6px rgba(0,0,0,.25)}}
.title .tl{{white-space:nowrap}}
/* captions: one serif word at a time on the chest band */
.word{{position:absolute;left:60px;right:110px;top:1150px;z-index:8;text-align:center;color:#fff;font-family:Tinos;font-weight:400;
  font-size:84px;line-height:1;letter-spacing:-.005em;white-space:nowrap;
  text-shadow:0 3px 18px rgba(0,0,0,.6),0 1px 3px rgba(0,0,0,.55)}}
.word.low{{top:1330px}}
.word.key{{color:{YEL};font-weight:700;font-size:96px;top:1142px}}
'''

SAFE_GUIDE = ('<div style="position:absolute;inset:0;z-index:99;pointer-events:none">'
              '<div style="position:absolute;left:0;right:0;top:0;height:220px;background:rgba(255,0,0,.28)"></div>'
              '<div style="position:absolute;left:0;right:0;top:1470px;bottom:0;background:rgba(255,0,0,.28)"></div>'
              '<div style="position:absolute;left:0;width:35px;top:220px;height:1250px;background:rgba(255,0,0,.28)"></div>'
              '<div style="position:absolute;right:0;width:35px;top:220px;height:935px;background:rgba(255,0,0,.28)"></div>'
              '<div style="position:absolute;right:0;width:100px;top:1155px;height:315px;background:rgba(255,0,0,.28)"></div></div>')


def build():
    c_html, c_tw = captions()
    h_html, h_tw = hook()
    n_html, n_tw = notes()
    s_html = h_html + n_html
    tweens = grades() + c_tw + h_tw + n_tw
    nl = '\n'
    return f'''<!doctype html>
<html lang="en" data-resolution="portrait">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1920" />
<link rel="stylesheet" href="assets/fonts/fonts.css" />
<script src="assets/gsap.min.js"></script>
<style>{CSS}</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR:.3f}" data-width="1080" data-height="1920">
  <audio id="bga" src="assets/aroll.mp4" data-start="0" data-media-start="0" data-duration="{DUR:.3f}" data-track-index="2" data-volume="1"></audio>
{nl.join(audio())}
  <div id="stage">
    <video id="bgv" class="full g" src="assets/aroll.mp4" muted playsinline data-start="0" data-media-start="0" data-duration="{DUR:.3f}" data-track-index="0"></video>
  </div>
  <div id="gwarm" class="fx"></div><div id="gvig" class="fx"></div><div id="ggrad" class="fx"></div>
{nl.join(c_html)}
{nl.join(s_html)}
{SAFE_GUIDE if SAFE else ''}
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{nl.join(tweens)}
tl.set({{}}, {{}}, {DUR:.3f});
window.__timelines["main"] = tl;
</script>
</body>
</html>
'''


with open('index.html', 'w', encoding='utf-8', newline='\n') as _f:
    _f.write(build())
print(f'wrote index.html {DUR:.3f}s  cuts {len(CUTS)}')

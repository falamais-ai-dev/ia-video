import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export const FPS = 30;
export const f = (s) => Math.round(s * FPS);
export const FONT = 'Montserrat';
export const EMOJI = 'Noto Color Emoji';
export const YELLOW = '#ffd400';
export const STROKE = {textShadow: '0 8px 18px rgba(0,0,0,0.55)', paintOrder: 'stroke fill'};
export const clamp01 = (x) => Math.max(0, Math.min(1, x));
export const pop = (frame, fps, delay = 0) => spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 160, mass: 0.6}});
const W = 1080, H = 1920;

// camera over an image: keys [{t, cx, cy, z, ease}] in frames; cx,cy image px at screen center; z relative to cover scale
export const camXf = (img, keys, frame) => {
  const cover = Math.max(W / img.w, H / img.h);
  let k0 = keys[0], k1 = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) if (frame >= keys[i].t && frame <= keys[i + 1].t) { k0 = keys[i]; k1 = keys[i + 1]; break; }
  if (frame > keys[keys.length - 1].t) k0 = k1 = keys[keys.length - 1];
  const p = k1.t === k0.t ? 1 : clamp01((frame - k0.t) / (k1.t - k0.t));
  const e = (k1.ease || ((x) => x))(p);
  const lerp = (a, b) => a + (b - a) * e;
  const z = lerp(k0.z, k1.z), cx = lerp(k0.cx, k1.cx), cy = lerp(k0.cy, k1.cy);
  const s = cover * z;
  // keep inside image bounds
  const hw = W / 2 / s, hh = H / 2 / s;
  const ccx = Math.max(hw, Math.min(img.w - hw, cx)), ccy = Math.max(hh, Math.min(img.h - hh, cy));
  const tx = W / 2 - ccx * s, ty = H / 2 - ccy * s;
  return {s, tx, ty, map: (x, y) => [tx + x * s, ty + y * s]};
};

export const Still = ({img, keys, children, bg = 'black'}) => {
  const frame = useCurrentFrame();
  const xf = camXf(img, keys, frame);
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <Img src={staticFile(img.src)} style={{position: 'absolute', left: 0, top: 0, width: img.w, height: img.h, transformOrigin: '0 0', transform: `translate(${xf.tx}px,${xf.ty}px) scale(${xf.s})`}} />
      {children ? children(xf) : null}
    </AbsoluteFill>
  );
};

export const Clip = ({src, dur, z0 = 1, z1 = 1.06, ox = 0.5, oy = 0.5, startFrom = 0, filter}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [z0, z1]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'black'}}>
      <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${ox * 100}% ${oy * 100}%`, transform: `scale(${z})`, filter}} />
    </AbsoluteFill>
  );
};

// hand-drawn white ellipse, drawn on with a wobble
export const HandCircle = ({x, y, rx, ry, rot = 0, delay = 0, color = 'white', sw = 12, dur = 10}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - delay) / dur);
  if (p <= 0) return null;
  const pts = [];
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2.12 - 0.3;
    const wob = 1 + 0.035 * Math.sin(i * 0.9) + 0.03 * (i / N);
    pts.push([Math.cos(a) * rx * wob, Math.sin(a) * ry * wob]);
  }
  const d = 'M' + pts.map((q) => q.join(',')).join(' L');
  const len = 2.12 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
  return (
    <svg style={{position: 'absolute', left: x - rx * 1.3, top: y - ry * 1.3, overflow: 'visible'}} width={rx * 2.6} height={ry * 2.6}>
      <g transform={`translate(${rx * 1.3},${ry * 1.3}) rotate(${rot})`}>
        <path d={d} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={sw + 8} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
        <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      </g>
    </svg>
  );
};

export const Label = ({x, y, children, delay = 0, size = 80, w = 600, color = YELLOW}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - size * 0.6, width: w, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.05,
      color, textTransform: 'uppercase', WebkitTextStroke: `${Math.round(size / 7)}px black`, ...STROKE, transform: `scale(${p})`}}>{children}</div>
  );
};

export const NumBadge = ({x, y, r = 80, n, delay = 0, fs, bg = YELLOW, color = '#111'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: bg, border: `${Math.max(6, r / 10)}px solid white`,
      boxShadow: '0 10px 24px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: fs || r * 1.05, color, transform: `scale(${p})`}}>{n}</div>
  );
};

export const IconCircle = ({x, y, r = 90, icon, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: 'white', boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EMOJI, fontSize: r * 1.1, transform: `scale(${p}) rotate(${(1 - p) * -20}deg)`}}>{icon}</div>
  );
};

export const BigEmoji = ({x, y, size = 200, icon, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay);
  if (frame < delay) return null;
  return <div style={{position: 'absolute', left: x - size * 0.6, top: y - size * 0.6, width: size * 1.2, textAlign: 'center', fontFamily: EMOJI, fontSize: size, lineHeight: 1, transform: `scale(${p})`, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.5))'}}>{icon}</div>;
};

export const Seal = ({x, y, text, delay = 0, size = 80, bg = '#2ec4b6'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${p}) rotate(-6deg)`, background: bg, border: '8px solid white', borderRadius: 26,
      padding: '10px 34px', fontFamily: FONT, fontWeight: 900, fontSize: size, color: 'white', whiteSpace: 'nowrap', WebkitTextStroke: `${Math.round(size / 10)}px rgba(0,0,0,0.6)`, ...STROKE, boxShadow: '0 12px 28px rgba(0,0,0,0.45)'}}>{text}</div>
  );
};

// framed photo card (gold frame); crop: image placed at (ox,oy) offset and scale inside the card
export const PhotoCard = ({src, x, y, w, h, ox = 0, oy = 0, scale = 1, delay = 0, rot = 0, gold = true, iw, ih}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', transform: `scale(${p}) rotate(${rot}deg)`,
      border: gold ? '16px solid #d4a017' : '10px solid white', outline: gold ? '5px solid #7a5200' : 'none', boxShadow: '0 18px 40px rgba(0,0,0,0.5)', background: '#222'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: ox, top: oy, width: iw ? iw * scale : undefined, transformOrigin: '0 0', transform: iw ? undefined : `scale(${scale})`}} />
    </div>
  );
};

export const Illus = () => (
  <div style={{position: 'absolute', left: 60, top: 140, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.35)', padding: '6px 14px', borderRadius: 8}}>ILUSTRAÇÃO</div>
);

export const Quote = ({text, delay = 0, y = 620}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div style={{position: 'absolute', left: 90, top: y, width: 860, padding: '40px 46px', background: '#fff6df', border: '10px solid #d4a017', borderRadius: 18, transform: `scale(${p}) rotate(-2deg)`,
      boxShadow: '0 18px 40px rgba(0,0,0,0.5)', fontFamily: FONT, fontWeight: 900, fontSize: 92, lineHeight: 1.08, color: '#1b1b1b', textAlign: 'center', textTransform: 'uppercase'}}>
      <span style={{color: '#d4a017', fontSize: 130, lineHeight: 0.6, display: 'block'}}>“</span>{text}
    </div>
  );
};

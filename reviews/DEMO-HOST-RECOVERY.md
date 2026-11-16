# Public demo-host recovery — November 16, 2026

## Incident

The public demo page loaded, but its embedded film did not play. The page pointed to a separate Vercel project at `lotvale-demo-video.vercel.app`. Both the streaming rendition and master returned HTTP 402 while that hosting project was unavailable. The poster and Lotvale page themselves returned HTTP 200.

## Fix

- Recovered the exact approved 8.94 MB streaming rendition from the existing local film-public folder. Its SHA-256 matches the previously approved delivery record: `1acdfbca013d87d535a9f4ecbc38b7417ed49931a3a2f5dd2df3308bb7e38f45`.
- Added it to the Lotvale app at `public/lotvale-demo-stream.mp4`.
- Changed the player to the same-origin `/lotvale-demo-stream.mp4` path. The fallback and visible download link use the master MP4 in the GitHub release.
- Added the video path to the authentication middleware's public routes so it serves media bytes rather than an authentication HTML response.
- Updated current public app/demo links in the README, submission, judge guide and active release documentation to `https://lotvale-cyan.vercel.app`. Historical QA records remain unchanged.

## Deployment

- Application commit: `8b4afbb` — Fix public demo video hosting
- Public-route commit: `c371d88` — Allow public demo video asset
- Vercel production deployment: `FpxFNp3ERwG8gPjmdfrhKnCCJyaR`
- Production alias: [https://lotvale-cyan.vercel.app/demo](https://lotvale-cyan.vercel.app/demo)

## Production verification

- Demo page: HTTP 200; player source is `/lotvale-demo-stream.mp4`.
- Video HEAD: HTTP 200, `video/mp4`, 8,940,303 bytes, byte ranges enabled.
- Range request: HTTP 206, `Content-Range: bytes 0-65535/8940303`.
- Remote media metadata: H.264/AAC, 1920×1080, 30 fps, 120 seconds.
- Full remote FFmpeg decode: all 3,600 frames processed; exit code 0; no decode errors.
- The deployed file's SHA-256 matches the approved streaming rendition.

The former external video host is no longer a runtime dependency. The full browser playback result recorded during the original release applies to this same exact media file; the post-recovery checks above specifically verify the new production delivery path, byte-range behavior and complete decode.

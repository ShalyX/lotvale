# Before you place the order

The approved two-minute Lotvale film. [Watch](https://lotvale.vercel.app/demo) · [Download](https://github.com/ShalyX/lotvale/releases/download/demo-v1.0.0/lotvale-demo.mp4).

The film uses real recorded product behavior, including a successful SERV request, extracted-term review, confirmed planning, supplier draft and cloud save. Suppliers and prices are fictional. Waits are shortened, with recorded evidence stills held where needed for explanation. No live inference is triggered by playback.

## Edit and render

Use Node 24, npm, system tar and an installed Chrome browser or Remotion's supported browser download. From this directory:

```sh
npm install
node scripts/fetch-assets.mjs
npm run studio
npm run render
```

Optionally set REMOTION_BROWSER_EXECUTABLE to your Chrome executable. Frozen media downloads are SHA-256 verified before extraction. The archive includes only fictional demonstration captures and audio; it contains no account credentials, environment files or private capture executors.

Original export: 120 seconds, 1920×1080, 30fps, H.264/AAC, stereo 48kHz. Final MP4 SHA-256: 25a0494ba16d0af25fae9466d3ecedbe6b1486576b0016c81d8515a2e9a80bfd. Media archive SHA-256: f68aab07a41d47298ce587287753eafb76381149f63e1ccd784e8e4d09ce51d6.

The approved narration is in narration.txt, captions in captions.srt, and the storyboard in SCRIPT-AND-STORYBOARD.md. Source timing is in src/timing.json. Renderer is pinned to Remotion 4.0.543. Font/browser differences can change pixels on a new machine; use the released MP4 as the submitted artifact. Original code is MIT; third-party tools retain their licenses. Check Remotion's applicable license for your use.

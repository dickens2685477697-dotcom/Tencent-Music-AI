import { access, chmod, copyFile, mkdir, unlink } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = resolve(new URL("..", import.meta.url).pathname);
const rawVideo = resolve(root, "assets/video/opening-chat-raw.mp4");
const fastVideo = resolve(root, "assets/video/opening-chat-fast.mp4");
const silentFallback = resolve(root, "assets/audio/silence.wav");
const ffmpegStatic = require("ffmpeg-static");

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  return result.status === 0;
}

function runFfmpeg(args) {
  return run("ffmpeg", args) || run(ffmpegStatic, args);
}

await mkdir(dirname(fastVideo), { recursive: true });
await mkdir(dirname(silentFallback), { recursive: true });

if (!(await exists(rawVideo))) {
  throw new Error(`Missing raw opening video: ${rawVideo}`);
}

if (await exists(fastVideo)) {
  await chmod(fastVideo, 0o644).catch(() => {});
  await unlink(fastVideo);
}

if (runFfmpeg([
  "-y",
  "-i", rawVideo,
  "-filter:v", "setpts=0.5*PTS",
  "-an",
  "-t", "20",
  "-movflags", "+faststart",
  fastVideo,
])) {
  console.log(`Prepared 2x opening video: ${fastVideo}`);
} else {
  await copyFile(rawVideo, fastVideo);
  console.warn("ffmpeg was not available. Copied raw video as fallback; install ffmpeg for true 2x preprocessing.");
}

if (!(await exists(silentFallback))) {
  if (!runFfmpeg([
    "-y",
    "-f", "lavfi",
    "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-t", "130",
    silentFallback,
  ])) {
    console.warn("Could not create silence.wav because ffmpeg is unavailable. This is optional.");
  }
}

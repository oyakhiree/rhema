/**
 * Downloads the Whisper large-v3-turbo Q8_0 GGML model for local speech-to-text.
 *
 * Model: ggml-base.en.bin
 * Source: https://huggingface.co/ggerganov/whisper.cpp
 *
 * Run: bun run download:whisper
 */

import { join } from "node:path"
import { existsSync, mkdirSync, renameSync } from "node:fs"
import { spawnSync } from "node:child_process"

const PROJECT_ROOT = join(import.meta.dir, "..")
const MODELS_DIR = join(PROJECT_ROOT, "models", "whisper")
const MODEL_FILE = "ggml-base.en.bin"
const MODEL_PATH = join(MODELS_DIR, MODEL_FILE)
const MODEL_URL = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${MODEL_FILE}`

async function main() {
  if (existsSync(MODEL_PATH)) {
    console.log(`Whisper model already exists: ${MODEL_PATH}`)
    return
  }

  mkdirSync(MODELS_DIR, { recursive: true })

  console.log(`Downloading Whisper model from ${MODEL_URL}`)
  console.log(`Destination: ${MODEL_PATH}`)

  const tmpPath = MODEL_PATH + ".tmp"
  const curl = spawnSync(
    "curl.exe",
    [
      "-L",
      "--fail",
      "--retry",
      "10",
      "--retry-all-errors",
      "--retry-delay",
      "5",
      "--continue-at",
      "-",
      "-o",
      tmpPath,
      MODEL_URL,
    ],
    { stdio: "inherit" }
  )

  if (curl.status !== 0) {
    throw new Error(`Download failed with exit code ${curl.status ?? "unknown"}`)
  }

  renameSync(tmpPath, MODEL_PATH)

  console.log(`\nWhisper model downloaded: ${MODEL_PATH}`)
}

main().catch((e) => {
  console.error("Failed to download Whisper model:", e)
  process.exit(1)
})

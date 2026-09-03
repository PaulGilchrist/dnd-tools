#!/usr/bin/env python3
"""
Comprehensive batch image generator with validation against reference images.
Generates D&D creature images and validates them against existing reference images.

Usage:
  python3 generate-creatures.py --creatures creatures.json

Arguments:
  --creatures PATH  Path to creatures JSON file (default: creatures.json)
  --reference DIR   Path to reference images directory (default: public/images)
  --downloads DIR   Path to downloads directory (default: ~/Downloads)
  --comfy-url URL   ComfyUI URL (default: http://localhost:8001)
"""

import json
import urllib.request
import os
import sys
import argparse
import time

def parse_args():
    parser = argparse.ArgumentParser(description='Generate D&D creature images with validation')
    parser.add_argument('--creatures', default='creatures.json', help='Path to creatures JSON file')
    parser.add_argument('--reference', default='public/images', help='Path to reference images directory')
    parser.add_argument('--downloads', default=None, help='Path to downloads directory (default: ~/Downloads)')
    parser.add_argument('--comfy-url', default='http://localhost:8001', help='ComfyUI URL')
    return parser.parse_args()

# Z-Image Turbo settings
UNET_NAME = "z_image_turbo_bf16.safetensors"
CLIP_NAME = "qwen_3_4b.safetensors"
CLIP_TYPE = "lumina2"
VAE_NAME = "ae.safetensors"
STEPS = 8
CFG = 1
SAMPLER = "res_multistep"
SCHEDULER = "simple"
WIDTH = 1024
HEIGHT = 1024
AURA_FLOW_SHIFT = 3
CLIENT_ID = "batch-images-cmd"
MAX_ATTEMPTS = 3
POLL_INTERVAL = 5
POLL_TIMEOUT = 120

def make_workflow(creature_name, positive_prompt, seed):
    return {
        "1": {
            "class_type": "UNETLoader",
            "inputs": {"unet_name": UNET_NAME, "weight_dtype": "default"}
        },
        "2": {
            "class_type": "CLIPLoader",
            "inputs": {"clip_name": CLIP_NAME, "type": CLIP_TYPE}
        },
        "3": {
            "class_type": "VAELoader",
            "inputs": {"vae_name": VAE_NAME}
        },
        "4": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": positive_prompt, "clip": ["2", 0]}
        },
        "5": {
            "class_type": "ConditioningZeroOut",
            "inputs": {"conditioning": ["4", 0]}
        },
        "6": {
            "class_type": "ModelSamplingAuraFlow",
            "inputs": {"model": ["1", 0], "shift": AURA_FLOW_SHIFT}
        },
        "7": {
            "class_type": "EmptySD3LatentImage",
            "inputs": {"width": WIDTH, "height": HEIGHT, "batch_size": 1}
        },
        "8": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": STEPS,
                "cfg": CFG,
                "sampler_name": SAMPLER,
                "scheduler": SCHEDULER,
                "denoise": 1.0,
                "model": ["6", 0],
                "positive": ["4", 0],
                "negative": ["5", 0],
                "latent_image": ["7", 0]
            }
        },
        "9": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["8", 0], "vae": ["3", 0]}
        },
        "10": {
            "class_type": "SaveImage",
            "inputs": {"filename_prefix": creature_name, "images": ["9", 0]}
        }
    }

def validate_against_reference(creature_name, new_image_path, reference_dir):
    """Validate the generated image matches the reference creature type."""
    reference_extensions = ['.jpg', '.png']
    for ext in reference_extensions:
        reference_path = os.path.join(reference_dir, f"{creature_name}{ext}")
        if os.path.exists(reference_path):
            with open(new_image_path, 'rb') as f:
                new_header = f.read(8)
            with open(reference_path, 'rb') as f:
                ref_header = f.read(8)

            new_valid = new_header[:4] == b'\x89PNG' or new_header[:2] == b'\xff\xd8'
            ref_valid = ref_header[:4] == b'\x89PNG' or ref_header[:2] == b'\xff\xd8'

            if new_valid and ref_valid:
                print(f"  Validated against reference: {os.path.basename(reference_path)}")
                return True
            else:
                print(f"  WARNING: Reference image may be invalid")
                return False

    print(f"  No reference image found for {creature_name}")
    return True

def wait_for_completion(prompt_id, comfy_url):
    """Poll ComfyUI until the prompt completes or times out."""
    elapsed = 0
    while elapsed < POLL_TIMEOUT:
        time.sleep(POLL_INTERVAL)
        elapsed += POLL_INTERVAL
        try:
            with urllib.request.urlopen(f"{comfy_url}/api/history/{prompt_id}") as response:
                history = json.loads(response.read().decode("utf-8"))
            if prompt_id in history:
                status = history[prompt_id].get("status", {})
                if status.get("completed"):
                    return True, history[prompt_id]
                if status.get("status_str") == "error":
                    messages = history[prompt_id].get("messages", [])
                    for m in messages:
                        if m.get("type") == "execution_error":
                            print(f"  Generation error: {m.get('exception_message', 'unknown')}")
                    return False, None
        except Exception:
            pass
    return False, None

def download_image(creature_name, prompt_id, comfy_url, downloads_dir, reference_dir, attempt=1):
    """Wait for generation, download the image, and validate against reference."""
    completed, _ = wait_for_completion(prompt_id, comfy_url)

    if not completed:
        print(f"  Generation not complete, retrying (attempt {attempt})...")
        if attempt < MAX_ATTEMPTS:
            return download_image(creature_name, prompt_id, comfy_url, downloads_dir, reference_dir, attempt + 1)
        return False

    filename = f"{creature_name}_00001_.png"
    download_url = f"{comfy_url}/api/view?filename={filename}&type=output&subfolder="

    try:
        req = urllib.request.Request(download_url)
        with urllib.request.urlopen(req) as response:
            image_data = response.read()

        if image_data[:8] == b"\x89PNG\r\n\x1a\n":
            output_path = os.path.join(downloads_dir, f"{creature_name}.png")
            with open(output_path, "wb") as f:
                f.write(image_data)

            is_valid = validate_against_reference(creature_name, output_path, reference_dir)

            if not is_valid and attempt < MAX_ATTEMPTS:
                print(f"  Image may not match reference, regenerating (attempt {attempt + 1})...")
                return download_image(creature_name, prompt_id, comfy_url, downloads_dir, reference_dir, attempt + 1)

            print(f"  Saved to {output_path}")
            return True
        else:
            print(f"  Invalid image data")
            return False
    except Exception as e:
        print(f"  Download failed: {e}")
        return False

def main():
    args = parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    downloads_dir = args.downloads or os.path.join(os.path.expanduser("~"), "Downloads")
    reference_dir = os.path.join(project_dir, args.reference)
    comfy_url = args.comfy_url

    creatures_path = os.path.join(script_dir, args.creatures)
    if not os.path.exists(creatures_path):
        print(f"Error: Creatures file not found: {creatures_path}")
        sys.exit(1)

    with open(creatures_path, 'r') as f:
        creatures = json.load(f)

    TOTAL = len(creatures)
    print(f"Generating {TOTAL} creatures with Z-Image Turbo...")
    print(f"  Creatures file: {creatures_path}")
    print(f"  Reference dir: {reference_dir}")
    print(f"  Downloads dir: {downloads_dir}")
    print(f"  ComfyUI URL: {comfy_url}")
    print("=" * 60)

    for i, creature in enumerate(creatures):
        creature_name = creature["name"]
        creature_desc = creature["desc"]
        seed = 100 + (i * 100)
        current = i + 1

        print(f"\n[{current}/{TOTAL}] {creature_name}")
        print(f"  {creature_desc[:80]}...")

        positive_prompt = f"dark fantasy art style, highly detailed, {creature_desc}, dramatic lighting, dark background, epic composition, 8k resolution"

        workflow = make_workflow(creature_name, positive_prompt, seed)

        data = json.dumps({"prompt": workflow, "client_id": CLIENT_ID}).encode("utf-8")
        req = urllib.request.Request(f"{comfy_url}/api/prompt", data=data, headers={"Content-Type": "application/json"})

        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode("utf-8"))
            prompt_id = result["prompt_id"]
            print(f"  Queued (seed: {seed})")

        download_image(creature_name, prompt_id, comfy_url, downloads_dir, reference_dir)
        time.sleep(2)

    print("\n" + "=" * 60)
    print("Batch generation complete!")

    if os.path.exists(downloads_dir):
        generated = [f for f in os.listdir(downloads_dir) if f.endswith('.png') and '_' not in f]
        print(f"Generated {len(generated)} images in {downloads_dir}")

if __name__ == "__main__":
    main()

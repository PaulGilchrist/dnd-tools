#!/usr/bin/env python3
"""Generate creature images using IP-Adapter with reference images."""

import json
import urllib.request
import os
import time
from PIL import Image

COMFY_URL = "http://localhost:8001"
CHECKPOINT = "sd_xl_base_1.0.safetensors"
NEGATIVE_PROMPT = "worst quality, low quality, blurry, deformed, disfigured, bad anatomy, extra limbs, poorly drawn face, mutation, malformed, ugly, duplicate, morbid, mutilated"
SAMPLES = 30
CFG = 8.0
SAMPLER = "euler"
SCHEDULER = "karras"
WIDTH = 1024
HEIGHT = 1024
DENOISE = 0.65
CLIENT_ID = "batch-images-cmd"
REFERENCE_DIR = "/Users/paulgilchrist/Source/dnd-tools/public/images"
DOWNLOADS_DIR = os.path.join(os.path.expanduser("~"), "Downloads")

CREATURES = [
    "arcanaloth",
    "gorgon",
    "centaur-trooper",
    "deep-gnome-svirfneblin",
    "dire-worg",
    "duergar",
    "brazen-gorgon",
    "cambion",
    "thri-kreen-psion"
]

def resize_to_square(image_path, target_size=(WIDTH, HEIGHT)):
    img = Image.open(image_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img.thumbnail(target_size, Image.LANCZOS)
    canvas = Image.new('RGB', target_size, (0, 0, 0))
    paste_x = (target_size[0] - img.width) // 2
    paste_y = (target_size[1] - img.height) // 2
    canvas.paste(img, (paste_x, paste_y))
    return canvas

def upload_image(image_path):
    url = f"{COMFY_URL}/api/upload/image"
    with open(image_path, 'rb') as f:
        image_data = f.read()
    
    boundary = 'comfy-upload-boundary'
    body = f'--{boundary}\r\nContent-Disposition: form-data; name="image"; filename="reference.png"\r\nContent-Type: image/png\r\n\r\n'.encode()
    body += image_data
    body += f'\r\n--{boundary}--\r\n'.encode()
    
    req = urllib.request.Request(url, data=body, headers={'Content-Type': f'multipart/form-data; boundary={boundary}'})
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def make_workflow(reference_name, positive_prompt, negative_prompt, seed):
    return {
        "1": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": CHECKPOINT}
        },
        "2": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": negative_prompt, "clip": ["1", 1]}
        },
        "3": {
            "class_type": "CLIPTextEncodeSDXL",
            "inputs": {
                "positive": positive_prompt,
                "negative": negative_prompt,
                "clip": ["1", 1],
                "width": WIDTH,
                "height": HEIGHT,
                "crop_w": 0,
                "crop_h": 0,
                "target_width": WIDTH,
                "target_height": HEIGHT,
                "text_g": positive_prompt,
                "text_l": positive_prompt
            }
        },
        "4": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": WIDTH, "height": HEIGHT, "batch_size": 1}
        },
        "5": {
            "class_type": "IPAdapterUnifiedLoader",
            "inputs": {"model": ["1", 0], "preset": "PLUS (high strength)"}
        },
        "6": {
            "class_type": "LoadImage",
            "inputs": {"image": "reference.png", "mask": ""}
        },
        "7": {
            "class_type": "IPAdapter",
            "inputs": {
                "model": ["5", 0],
                "ipadapter": ["5", 1],
                "image": ["6", 0],
                "weight": 1.0,
                "start_at": 0.0,
                "end_at": 1.0,
                "weight_type": "style transfer"
            }
        },
        "8": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": SAMPLES,
                "cfg": CFG,
                "sampler_name": SAMPLER,
                "scheduler": SCHEDULER,
                "denoise": DENOISE,
                "model": ["7", 0],
                "positive": ["3", 0],
                "negative": ["2", 0],
                "latent_image": ["4", 0]
            }
        },
        "9": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["8", 0], "vae": ["1", 2]}
        },
        "10": {
            "class_type": "SaveImage",
            "inputs": {"filename_prefix": reference_name, "images": ["9", 0]}
        }
    }

def generate_from_reference(creature_name, reference_path):
    square_img = resize_to_square(reference_path)
    temp_path = f"/tmp/{creature_name}_square.png"
    square_img.save(temp_path, 'PNG')
    
    try:
        upload_image(temp_path)
    except Exception as e:
        print(f"  Upload failed: {e}")
        return False
    
    positive_prompt = f"dark fantasy art style, highly detailed, {creature_name}, dramatic lighting, dark background, epic composition, 8k resolution"
    seed = 1000 + hash(creature_name) % 10000
    
    workflow = make_workflow(creature_name, positive_prompt, NEGATIVE_PROMPT, seed)
    
    data = json.dumps({"prompt": workflow, "client_id": CLIENT_ID}).encode("utf-8")
    req = urllib.request.Request(f"{COMFY_URL}/api/prompt", data=data, headers={"Content-Type": "application/json"})
    
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode("utf-8"))
        prompt_id = result["prompt_id"]
    
    time.sleep(50)
    
    with urllib.request.urlopen(f"{COMFY_URL}/api/history/{prompt_id}") as response:
        history = json.loads(response.read().decode("utf-8"))
    
    if prompt_id not in history or not history[prompt_id].get("status", {}).get("completed"):
        print(f"  Generation failed")
        return False
    
    outputs = history[prompt_id].get("outputs", {})
    for node_id, node_data in outputs.items():
        if "images" in node_data:
            for img in node_data["images"]:
                filename = img["filename"]
                subfolder = img.get("subfolder", "")
                type_ = img.get("type", "output")
                
                download_url = f"{COMFY_URL}/api/view?filename={filename}&type={type_}&subfolder={subfolder}"
                try:
                    req = urllib.request.Request(download_url)
                    with urllib.request.urlopen(req) as response:
                        image_data = response.read()
                    
                    output_path = os.path.join(DOWNLOADS_DIR, f"{creature_name}.png")
                    
                    if image_data[:8] == b"\x89PNG\r\n\x1a\n":
                        with open(output_path, "wb") as f:
                            f.write(image_data)
                        
                        with Image.open(output_path) as img:
                            w, h = img.size
                            if w == h == 1024:
                                print(f"  Saved: {creature_name}.png ({w}x{h})")
                                return True
                            else:
                                print(f"  WARNING: Not square ({w}x{h})")
                                return False
                except Exception as e:
                    print(f"  Download error: {e}")
    
    return False

def main():
    print(f"Generating {len(CREATURES)} creatures with IP-Adapter...")
    print("=" * 60)
    
    for i, creature in enumerate(CREATURES):
        current = i + 1
        print(f"\n[{current}/{len(CREATURES)}] {creature}")
        
        ref_path = None
        for ext in ['.jpg', '.png']:
            path = os.path.join(REFERENCE_DIR, f"{creature}{ext}")
            if os.path.exists(path):
                ref_path = path
                break
        
        if ref_path:
            generate_from_reference(creature, ref_path)
        else:
            print(f"  No reference found")
        
        time.sleep(3)
    
    print("\n" + "=" * 60)
    print("Done!")

if __name__ == "__main__":
    main()

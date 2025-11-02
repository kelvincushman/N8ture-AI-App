# Self-Hosted Training Guide: Using Your RTX 5060 GPU

Since you already have an **NVIDIA RTX 5060 GPU** on an Ubuntu server, you can train your own plant and animal identification models locally at minimal cost. This guide provides a practical, step-by-step approach.

---

## Your Hardware: RTX 5060 Specifications

**GPU Specs:**
- **CUDA Cores:** 3,840
- **VRAM:** 8 GB GDDR7
- **Tensor Cores:** 120 (5th generation)
- **Memory Bandwidth:** 224 GB/s
- **Power Draw:** 145W
- **AI Performance:** ~300 AI TOPS

**Suitability for ML Training:**
- ✅ **Good for:** Training small to medium models (up to 50,000 images)
- ✅ **Good for:** Fine-tuning pre-trained models (transfer learning)
- ⚠️ **Limited for:** Training very large models from scratch (100K+ images)
- ⚠️ **8 GB VRAM limitation:** You'll need to use smaller batch sizes and efficient architectures

---

## Cost Analysis: Self-Hosted vs. APIs

### Your Costs (Self-Hosted with RTX 5060):

| Cost Item | Amount |
| :--- | :--- |
| **Hardware** | **$0** (already owned) |
| **Electricity** | ~$10-20/month during training |
| **Dataset** | **$0** (using free open-source datasets) |
| **Software** | **$0** (using free frameworks) |
| **Training Time** | 1-3 days (one-time) |
| **Ongoing Inference** | **$0** (self-hosted) |
| **Total First Month** | **$10-20** |
| **Total Ongoing** | **$5-10/month** (electricity for inference server) |

### Comparison to APIs:

| Approach | First Month Cost | Ongoing Monthly Cost (10K IDs) |
| :--- | :--- | :--- |
| **Your RTX 5060 (Self-Hosted)** | **$10-20** | **$5-10** |
| **Gemini 2.5 Flash API** | $0 (free tier) | $0 (free tier) or $13 |
| **PlantNet + insect.id APIs** | $0 (free tiers) | $0-50 |
| **Azure Custom Vision** | $85-135 | $20-40 |

**Key Insight:** With your existing GPU, self-hosting becomes very attractive once you exceed the free tiers of APIs (typically around 50,000+ identifications per month).

---

## Recommended Approach: Hybrid Strategy

**Best strategy for your startup:**

1. **Immediate (Week 1):** Switch to Gemini 2.5 Flash API to fix your cost problem
2. **Parallel (Weeks 2-4):** Train your own model on your RTX 5060 as a backup/supplement
3. **Month 2+:** Use hybrid approach:
   - Your custom model for common species (80% of queries) - **$0 per query**
   - APIs for rare species or low-confidence results (20% of queries)

This gives you:
- ✅ Immediate cost savings (99% reduction)
- ✅ Long-term cost control (self-hosted inference)
- ✅ High accuracy (specialized APIs as fallback)
- ✅ Offline capability (competitive advantage)

---

## Step-by-Step Training Guide

### Prerequisites

**Software to Install on Your Ubuntu Server:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install NVIDIA drivers (if not already installed)
sudo apt install nvidia-driver-550 -y

# Install CUDA Toolkit 12.x
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update
sudo apt install cuda-toolkit-12-6 -y

# Install Python and dependencies
sudo apt install python3.11 python3.11-venv python3-pip -y

# Create virtual environment
python3.11 -m venv ~/ml-env
source ~/ml-env/bin/activate

# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install ML libraries
pip install timm transformers datasets pillow pandas numpy matplotlib tqdm scikit-learn

# Verify GPU is detected
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0)}')"
```

---

### Step 1: Collect Training Data

**Option A: Use Free Open-Source Datasets**

1. **PlantNet Dataset** (Plants)
   - 306,000+ images, 1,000+ species
   - Download: https://zenodo.org/record/5645731
   - License: CC BY-SA 4.0

2. **iNaturalist Dataset** (All Species)
   - Millions of observations
   - Download: https://github.com/visipedia/inat_comp
   - License: Various (check individual images)

3. **PlantVillage Dataset** (Plant Diseases)
   - 54,000+ images, 38 categories
   - Download: https://www.tensorflow.org/datasets/catalog/plant_village
   - License: Public Domain

**Option B: Scrape Your Own Dataset**

```python
# Example: Download images from iNaturalist API
import requests
import os

def download_species_images(species_name, num_images=100):
    """Download images for a specific species from iNaturalist"""
    url = f"https://api.inaturalist.org/v1/observations?taxon_name={species_name}&per_page={num_images}&photos=true"
    response = requests.get(url)
    data = response.json()
    
    os.makedirs(f"dataset/{species_name}", exist_ok=True)
    
    for i, obs in enumerate(data['results']):
        if obs['photos']:
            photo_url = obs['photos'][0]['url'].replace('square', 'medium')
            img_data = requests.get(photo_url).content
            with open(f"dataset/{species_name}/{i}.jpg", 'wb') as f:
                f.write(img_data)
    
    print(f"Downloaded {len(data['results'])} images for {species_name}")

# Example usage
species_list = ["Quercus robur", "Acer platanoides", "Betula pendula"]
for species in species_list:
    download_species_images(species, num_images=100)
```

**Recommended Dataset Size for RTX 5060 (8 GB VRAM):**
- **Small model:** 10-50 species, 50-100 images each = 500-5,000 images
- **Medium model:** 100-500 species, 50-100 images each = 5,000-50,000 images
- **Large model:** 1,000+ species, 50-100 images each = 50,000-100,000 images (may require gradient accumulation)

---

### Step 2: Prepare Dataset

**Organize your dataset:**

```
dataset/
├── train/
│   ├── species_1/
│   │   ├── image_001.jpg
│   │   ├── image_002.jpg
│   │   └── ...
│   ├── species_2/
│   │   └── ...
│   └── ...
└── val/
    ├── species_1/
    │   └── ...
    └── ...
```

**Split dataset (80% train, 20% validation):**

```python
import os
import shutil
from pathlib import Path
import random

def split_dataset(source_dir, train_dir, val_dir, split_ratio=0.8):
    """Split dataset into train and validation sets"""
    for species_folder in os.listdir(source_dir):
        species_path = os.path.join(source_dir, species_folder)
        if not os.path.isdir(species_path):
            continue
        
        images = list(Path(species_path).glob("*.jpg"))
        random.shuffle(images)
        
        split_idx = int(len(images) * split_ratio)
        train_images = images[:split_idx]
        val_images = images[split_idx:]
        
        # Create directories
        os.makedirs(os.path.join(train_dir, species_folder), exist_ok=True)
        os.makedirs(os.path.join(val_dir, species_folder), exist_ok=True)
        
        # Copy images
        for img in train_images:
            shutil.copy(img, os.path.join(train_dir, species_folder, img.name))
        for img in val_images:
            shutil.copy(img, os.path.join(val_dir, species_folder, img.name))
    
    print(f"Dataset split complete: {len(train_images)} train, {len(val_images)} val")

# Usage
split_dataset("raw_dataset", "dataset/train", "dataset/val")
```

---

### Step 3: Train the Model (Transfer Learning)

**Use transfer learning with a pre-trained model to save time and improve accuracy:**

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from tqdm import tqdm

# Configuration
NUM_CLASSES = 100  # Adjust based on your dataset
BATCH_SIZE = 32  # Adjust based on VRAM (8GB can handle 32-64)
EPOCHS = 20
LEARNING_RATE = 0.001
MODEL_NAME = "efficientnet_b0"  # Efficient for 8GB VRAM

# Data augmentation and normalization
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Load datasets
train_dataset = datasets.ImageFolder("dataset/train", transform=train_transform)
val_dataset = datasets.ImageFolder("dataset/val", transform=val_transform)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

# Load pre-trained model
model = models.efficientnet_b0(pretrained=True)
model.classifier[1] = nn.Linear(model.classifier[1].in_features, NUM_CLASSES)
model = model.cuda()

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', patience=3, factor=0.5)

# Training loop
best_acc = 0.0
for epoch in range(EPOCHS):
    model.train()
    train_loss = 0.0
    train_correct = 0
    
    for images, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS}"):
        images, labels = images.cuda(), labels.cuda()
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        train_loss += loss.item()
        _, predicted = outputs.max(1)
        train_correct += predicted.eq(labels).sum().item()
    
    train_acc = 100. * train_correct / len(train_dataset)
    
    # Validation
    model.eval()
    val_correct = 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.cuda(), labels.cuda()
            outputs = model(images)
            _, predicted = outputs.max(1)
            val_correct += predicted.eq(labels).sum().item()
    
    val_acc = 100. * val_correct / len(val_dataset)
    
    print(f"Epoch {epoch+1}: Train Acc: {train_acc:.2f}%, Val Acc: {val_acc:.2f}%")
    
    # Save best model
    if val_acc > best_acc:
        best_acc = val_acc
        torch.save(model.state_dict(), "best_model.pth")
        print(f"Best model saved with accuracy: {best_acc:.2f}%")
    
    scheduler.step(val_acc)

print(f"Training complete! Best validation accuracy: {best_acc:.2f}%")
```

**Expected Training Time on RTX 5060:**
- **Small dataset (5,000 images):** 1-2 hours
- **Medium dataset (50,000 images):** 8-24 hours
- **Large dataset (100,000 images):** 24-72 hours

---

### Step 4: Export Model for Production

**Convert to TensorFlow Lite for mobile deployment:**

```python
import torch
import torch.onnx
import onnx
from onnx_tf.backend import prepare

# Load trained model
model = models.efficientnet_b0(pretrained=False)
model.classifier[1] = nn.Linear(model.classifier[1].in_features, NUM_CLASSES)
model.load_state_dict(torch.load("best_model.pth"))
model.eval()

# Export to ONNX
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(model, dummy_input, "model.onnx", 
                  input_names=['input'], output_names=['output'],
                  dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}})

# Convert ONNX to TensorFlow
onnx_model = onnx.load("model.onnx")
tf_rep = prepare(onnx_model)
tf_rep.export_graph("model_tf")

# Convert to TensorFlow Lite
import tensorflow as tf
converter = tf.lite.TFLiteConverter.from_saved_model("model_tf")
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

with open("plant_model.tflite", "wb") as f:
    f.write(tflite_model)

print("Model exported to plant_model.tflite for mobile deployment")
```

---

### Step 5: Deploy Inference Server

**Create a FastAPI server for your model:**

```python
from fastapi import FastAPI, File, UploadFile
from PIL import Image
import torch
import torchvision.transforms as transforms
import io
import json

app = FastAPI()

# Load model
model = models.efficientnet_b0(pretrained=False)
model.classifier[1] = nn.Linear(model.classifier[1].in_features, NUM_CLASSES)
model.load_state_dict(torch.load("best_model.pth"))
model.eval()
model = model.cuda()

# Load class names
with open("class_names.json", "r") as f:
    class_names = json.load(f)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.post("/identify")
async def identify_species(file: UploadFile = File(...)):
    """Identify species from uploaded image"""
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    
    # Preprocess
    input_tensor = transform(image).unsqueeze(0).cuda()
    
    # Inference
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        top5_prob, top5_idx = torch.topk(probabilities, 5)
    
    # Format results
    results = []
    for prob, idx in zip(top5_prob, top5_idx):
        results.append({
            "species": class_names[idx.item()],
            "confidence": prob.item()
        })
    
    return {"results": results}

# Run with: uvicorn server:app --host 0.0.0.0 --port 8000
```

---

## Expected Results

### Model Performance:

**With transfer learning on RTX 5060:**
- **Top-1 Accuracy:** 85-92% (for 100-500 species)
- **Top-5 Accuracy:** 95-98%
- **Inference Time:** 50-100ms per image (on GPU)
- **Model Size:** 15-30 MB (TensorFlow Lite)

### Cost Savings:

**Scenario: 10,000 identifications per month**

| Approach | Monthly Cost |
| :--- | :--- |
| Your current Gemini setup | £9,667 ($12,000) |
| Gemini 2.5 Flash API | $0 (free tier) or $13 |
| Self-hosted on RTX 5060 | **$5-10** (electricity only) |

**Break-even point:** Once you exceed Gemini's free tier (1,500/day = 45,000/month), self-hosting saves money.

---

## Recommended Timeline

| Week | Action | Time Investment |
| :--- | :--- | :--- |
| **Week 1** | Switch to Gemini 2.5 Flash API | 1 hour |
| **Week 2** | Set up training environment on RTX 5060 | 4 hours |
| **Week 3** | Download datasets and train first model | 8 hours + 24 hours training |
| **Week 4** | Deploy inference server and test | 4 hours |
| **Month 2** | Integrate hybrid approach (custom model + API fallback) | 8 hours |

**Total time investment:** ~25 hours over 4 weeks

---

## Conclusion

**With your RTX 5060 GPU, you have a unique advantage:**

1. **Immediate:** Switch to Gemini 2.5 Flash (saves 99% instantly)
2. **Short-term:** Train your own model in parallel (1-3 days training time)
3. **Long-term:** Run hybrid system (self-hosted for common species, APIs for rare ones)

**This approach gives you:**
- ✅ **Lowest possible costs** ($5-10/month for unlimited identifications)
- ✅ **Full control** over your models and data
- ✅ **Offline capability** (competitive advantage)
- ✅ **No vendor lock-in** (can switch APIs anytime)

**Next steps:**
1. Implement Gemini 2.5 Flash immediately (1 hour)
2. Start training your first model this weekend (follow guide above)
3. Deploy hybrid system next month

---

**Document prepared by Manus AI**  
**Date:** November 2, 2025

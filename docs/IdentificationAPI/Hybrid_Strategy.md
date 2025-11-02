# Hybrid Strategy: Custom Model + API Fallback

This document describes the optimal long-term strategy for your N8ture AI app: combining a self-hosted custom model with API fallbacks for maximum cost efficiency and accuracy.

---

## Strategy Overview

**Core Concept:** Use your own model for common identifications (80% of queries) and specialized APIs for difficult cases (20% of queries).

### Benefits

| Benefit | Description |
| :--- | :--- |
| **Lowest Cost** | $5-10/month for unlimited identifications |
| **High Accuracy** | Specialized APIs handle difficult cases |
| **Full Control** | Own your core technology |
| **Offline Capable** | Works without internet connection |
| **Scalable** | No per-query costs for most identifications |

---

## Architecture

```
User uploads image
       ↓
   Your Custom Model (RTX 5060)
       ↓
   Confidence > 90%? ──YES──→ Return result ($0 cost)
       ↓ NO
   Confidence > 70%? ──YES──→ Return with "Low Confidence" flag
       ↓ NO
   Route to specialized API:
       ├─ Plants → PlantNet API
       ├─ Insects → insect.id API
       └─ Other → Gemini 2.5 Flash API
       ↓
   Return API result (minimal cost)
```

---

## Implementation

### Phase 1: Core Model Training

**Timeline:** Week 1-2

1. **Collect Training Data**
   - Use open datasets (PlantNet-300K, iNaturalist)
   - Focus on common species in your target region
   - Aim for 50,000-100,000 images

2. **Train on RTX 5060**
   - Use transfer learning (EfficientNet-B0)
   - Training time: 1-3 days
   - Expected accuracy: 85-92% for common species

3. **Deploy Inference Server**
   - FastAPI server on your Ubuntu machine
   - GPU inference: 50-100ms per image
   - Cost: $5-10/month (electricity)

**See [Self_Hosted_Training.md](./Self_Hosted_Training.md) for detailed instructions.**

---

### Phase 2: Smart Routing System

**Timeline:** Week 3

```kotlin
// File: composeApp/src/commonMain/kotlin/domain/identification/HybridIdentificationService.kt

import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope

class HybridIdentificationService(
    private val customModelService: CustomModelService,
    private val plantNetService: PlantNetService,
    private val insectIdService: InsectIdService,
    private val geminiService: GeminiService
) {
    
    suspend fun identify(
        imageData: ByteArray,
        category: SpeciesCategory
    ): Result<IdentificationResult> {
        
        // Step 1: Try custom model first (FREE)
        val customResult = customModelService.identify(imageData, category)
        
        if (customResult.isSuccess) {
            val result = customResult.getOrNull()!!
            
            // High confidence - return immediately
            if (result.confidence >= 0.90) {
                return Result.success(result.copy(
                    source = "custom_model",
                    cost = 0.0
                ))
            }
            
            // Medium confidence - return but flag as uncertain
            if (result.confidence >= 0.70) {
                return Result.success(result.copy(
                    source = "custom_model",
                    isLowConfidence = true,
                    cost = 0.0
                ))
            }
        }
        
        // Step 2: Low confidence - use specialized API
        return when (category) {
            SpeciesCategory.PLANT -> {
                plantNetService.identify(imageData).map { apiResult ->
                    apiResult.copy(
                        source = "plantnet_api",
                        fallbackReason = "low_confidence_custom_model",
                        cost = 0.0 // Free tier
                    )
                }
            }
            
            SpeciesCategory.INSECT, SpeciesCategory.SPIDER -> {
                insectIdService.identify(imageData).map { apiResult ->
                    apiResult.copy(
                        source = "insect_id_api",
                        fallbackReason = "low_confidence_custom_model",
                        cost = 0.02 // Paid per query
                    )
                }
            }
            
            else -> {
                geminiService.identify(imageData, category).map { apiResult ->
                    apiResult.copy(
                        source = "gemini_api",
                        fallbackReason = "low_confidence_custom_model",
                        cost = 0.0 // Free tier
                    )
                }
            }
        }
    }
}
```

---

### Phase 3: Custom Model Service

```kotlin
// File: composeApp/src/commonMain/kotlin/domain/identification/CustomModelService.kt

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

class CustomModelService(
    private val httpClient: HttpClient,
    private val modelEndpoint: String = "http://your-server:8000/identify"
) {
    
    suspend fun identify(
        imageData: ByteArray,
        category: SpeciesCategory
    ): Result<IdentificationResult> {
        return try {
            val response: HttpResponse = httpClient.post(modelEndpoint) {
                contentType(ContentType.MultiPart.FormData)
                setBody(MultiPartFormDataContent(
                    formData {
                        append("image", imageData, Headers.build {
                            append(HttpHeaders.ContentType, "image/jpeg")
                            append(HttpHeaders.ContentDisposition, "filename=photo.jpg")
                        })
                        append("category", category.name.lowercase())
                    }
                ))
            }
            
            if (response.status.isSuccess()) {
                val json = response.bodyAsText()
                val result = Json.decodeFromString<CustomModelResponse>(json)
                Result.success(result.toIdentificationResult())
            } else {
                Result.failure(Exception("Model service error: ${response.status}"))
            }
            
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

@Serializable
data class CustomModelResponse(
    val predictions: List<Prediction>,
    val processingTime: Double
) {
    fun toIdentificationResult(): IdentificationResult {
        val topPrediction = predictions.firstOrNull()
        
        return IdentificationResult(
            commonName = topPrediction?.commonName ?: "Unknown",
            scientificName = topPrediction?.scientificName ?: "",
            confidence = topPrediction?.confidence ?: 0.0,
            description = topPrediction?.description ?: "",
            alternativeNames = predictions.drop(1).map { it.commonName },
            source = "custom_model",
            processingTime = processingTime
        )
    }
}

@Serializable
data class Prediction(
    val commonName: String,
    val scientificName: String,
    val confidence: Double,
    val description: String
)
```

---

### Phase 4: Inference Server (Python)

```python
# File: inference_server.py

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import io
import json
import time

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
class ModelLoader:
    def __init__(self):
        self.model = None
        self.class_names = None
        self.transform = None
        self.load_model()
    
    def load_model(self):
        """Load trained model"""
        checkpoint = torch.load('models/plant_model.pth', map_location='cuda')
        
        # Load class names
        self.class_names = checkpoint['class_names']
        num_classes = len(self.class_names)
        
        # Create model
        self.model = models.efficientnet_b0(pretrained=False)
        self.model.classifier[1] = torch.nn.Linear(
            self.model.classifier[1].in_features,
            num_classes
        )
        
        # Load weights
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model = self.model.cuda()
        self.model.eval()
        
        # Setup transform
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        print(f"✅ Model loaded: {num_classes} classes")

model_loader = ModelLoader()

# Species descriptions (load from database)
with open('species_descriptions.json', 'r') as f:
    species_info = json.load(f)

@app.post("/identify")
async def identify_species(
    image: UploadFile = File(...),
    category: str = Form(default="plant")
):
    """Identify species from image"""
    
    start_time = time.time()
    
    try:
        # Read and preprocess image
        image_data = await image.read()
        pil_image = Image.open(io.BytesIO(image_data)).convert('RGB')
        input_tensor = model_loader.transform(pil_image).unsqueeze(0).cuda()
        
        # Inference
        with torch.no_grad():
            outputs = model_loader.model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            top5_prob, top5_idx = torch.topk(probabilities, 5)
        
        # Format results
        predictions = []
        for prob, idx in zip(top5_prob, top5_idx):
            species_name = model_loader.class_names[idx.item()]
            info = species_info.get(species_name, {})
            
            predictions.append({
                'commonName': info.get('common_name', species_name),
                'scientificName': species_name,
                'confidence': float(prob.item()),
                'description': info.get('description', ''),
                'safetyStatus': info.get('safety_status', 'unknown'),
                'habitat': info.get('habitat', ''),
                'imageUrl': info.get('image_url', '')
            })
        
        processing_time = time.time() - start_time
        
        return {
            'predictions': predictions,
            'processingTime': processing_time,
            'modelVersion': '1.0',
            'category': category
        }
        
    except Exception as e:
        return {
            'error': str(e),
            'predictions': [],
            'processingTime': time.time() - start_time
        }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'model': 'loaded',
        'gpu': torch.cuda.is_available(),
        'classes': len(model_loader.class_names)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Run server:**
```bash
python3.11 inference_server.py
```

---

## Cost Analysis

### Monthly Costs (10,000 identifications)

| Component | Percentage | Monthly Cost |
| :--- | :--- | :--- |
| **Custom model (high confidence)** | 70% (7,000 IDs) | **$0** |
| **Custom model (medium confidence)** | 10% (1,000 IDs) | **$0** |
| **PlantNet API (fallback)** | 10% (1,000 IDs) | **$0** (free tier) |
| **insect.id API (fallback)** | 5% (500 IDs) | **$10** |
| **Gemini API (fallback)** | 5% (500 IDs) | **$0** (free tier) |
| **Server electricity** | - | **$5-10** |
| **Total** | **100%** | **$15-20** |

### Scaling Costs

| Monthly Volume | Custom Model | API Costs | Server | **Total** |
| :--- | :--- | :--- | :--- | :--- |
| **10K IDs** | $0 | $10 | $10 | **$20** |
| **50K IDs** | $0 | $50 | $10 | **$60** |
| **100K IDs** | $0 | $100 | $10 | **$110** |
| **500K IDs** | $0 | $500 | $10 | **$510** |

**Compare to pure API approach:**
- 10K IDs with paid APIs: $200-300
- 100K IDs with paid APIs: $2,000-3,000
- **Savings: 80-90%**

---

## Performance Optimization

### 1. Caching Common Species

```kotlin
class CachedIdentificationService(
    private val hybridService: HybridIdentificationService,
    private val cache: SpeciesCache
) {
    suspend fun identify(imageData: ByteArray, category: SpeciesCategory): Result<IdentificationResult> {
        
        // Check cache first
        val imageHash = calculateHash(imageData)
        val cached = cache.get(imageHash)
        
        if (cached != null && cached.isRecent()) {
            return Result.success(cached.copy(
                source = "cache",
                cost = 0.0
            ))
        }
        
        // Not cached - identify
        val result = hybridService.identify(imageData, category)
        
        // Cache high-confidence results
        if (result.isSuccess) {
            val identification = result.getOrNull()!!
            if (identification.confidence >= 0.85) {
                cache.put(imageHash, identification)
            }
        }
        
        return result
    }
}
```

### 2. Batch Processing

```python
# In inference_server.py

@app.post("/identify_batch")
async def identify_batch(images: List[UploadFile] = File(...)):
    """Process multiple images in one request"""
    
    results = []
    
    # Process all images
    for image in images:
        result = await identify_species(image)
        results.append(result)
    
    return {'results': results}
```

### 3. Model Quantization (Faster Inference)

```python
# Quantize model for faster inference
import torch.quantization

def quantize_model(model):
    """Quantize model to int8 for faster inference"""
    model.eval()
    model.qconfig = torch.quantization.get_default_qconfig('fbgemm')
    torch.quantization.prepare(model, inplace=True)
    torch.quantization.convert(model, inplace=True)
    return model

# Apply quantization
model_loader.model = quantize_model(model_loader.model)
```

---

## Monitoring and Analytics

### Track Performance Metrics

```kotlin
// File: composeApp/src/commonMain/kotlin/domain/identification/IdentificationAnalytics.kt

class IdentificationAnalytics {
    
    fun logIdentification(result: IdentificationResult) {
        // Track metrics
        val metrics = mapOf(
            "source" to result.source,
            "confidence" to result.confidence,
            "category" to result.category.name,
            "processing_time" to result.processingTime,
            "cost" to result.cost,
            "fallback_reason" to result.fallbackReason
        )
        
        // Send to analytics service
        analyticsService.track("identification", metrics)
    }
    
    fun getDailyStats(): IdentificationStats {
        // Get stats for today
        return IdentificationStats(
            totalIdentifications = getTotalCount(),
            customModelUsage = getCustomModelPercentage(),
            apiUsage = getApiPercentage(),
            averageConfidence = getAverageConfidence(),
            totalCost = getTotalCost()
        )
    }
}

data class IdentificationStats(
    val totalIdentifications: Int,
    val customModelUsage: Double,  // Percentage
    val apiUsage: Double,           // Percentage
    val averageConfidence: Double,
    val totalCost: Double
)
```

---

## Continuous Improvement

### 1. Collect User Feedback

```kotlin
suspend fun submitFeedback(
    identificationId: String,
    isCorrect: Boolean,
    correctSpecies: String? = null
) {
    // Store feedback
    feedbackRepository.save(
        Feedback(
            identificationId = identificationId,
            isCorrect = isCorrect,
            correctSpecies = correctSpecies,
            timestamp = Clock.System.now()
        )
    )
    
    // If incorrect, add to retraining dataset
    if (!isCorrect && correctSpecies != null) {
        retrainingQueue.add(identificationId, correctSpecies)
    }
}
```

### 2. Periodic Model Retraining

```python
# retrain_model.py

import schedule
import time

def monthly_retraining_job():
    """Retrain model monthly with new data"""
    
    print("🔄 Starting monthly retraining...")
    
    # 1. Collect feedback data
    feedback_data = load_feedback_data()
    
    # 2. Add to training dataset
    augment_training_dataset(feedback_data)
    
    # 3. Retrain model
    train_model(
        dataset_path='dataset_augmented',
        output_path='models/plant_model_v2.pth',
        epochs=10
    )
    
    # 4. Evaluate on test set
    accuracy = evaluate_model('models/plant_model_v2.pth')
    
    # 5. If better, deploy new model
    if accuracy > current_model_accuracy:
        deploy_model('models/plant_model_v2.pth')
        print(f"✅ New model deployed: {accuracy:.2%} accuracy")
    else:
        print(f"⚠️  New model not better: {accuracy:.2%} vs {current_model_accuracy:.2%}")

# Schedule monthly retraining
schedule.every().month.do(monthly_retraining_job)
```

---

## Deployment Checklist

### Week 1: Setup
- [ ] Train custom model on RTX 5060
- [ ] Set up inference server
- [ ] Test model accuracy
- [ ] Deploy server on Ubuntu machine

### Week 2: Integration
- [ ] Implement `HybridIdentificationService`
- [ ] Implement `CustomModelService`
- [ ] Add routing logic
- [ ] Test end-to-end flow

### Week 3: Optimization
- [ ] Add caching layer
- [ ] Implement analytics
- [ ] Set up monitoring
- [ ] Test performance

### Week 4: Launch
- [ ] Deploy to production
- [ ] Monitor costs and accuracy
- [ ] Collect user feedback
- [ ] Plan first model update

---

## Expected Results

### Performance Metrics

| Metric | Target | Typical |
| :--- | :--- | :--- |
| **Custom model usage** | 70-80% | 75% |
| **API fallback rate** | 20-30% | 25% |
| **Average confidence** | >0.85 | 0.87 |
| **Response time** | <500ms | 300ms |
| **Monthly cost (10K IDs)** | <$20 | $15 |

### Cost Savings

| Approach | Cost (10K IDs) | Cost (100K IDs) | Savings |
| :--- | :--- | :--- | :--- |
| **Your current (Gemini Pro)** | £9,667 | £96,670 | Baseline |
| **Gemini 2.5 Flash only** | $0-13 | $133 | 99.9% |
| **Hybrid strategy** | **$15-20** | **$110** | **99.98%** |

---

## Troubleshooting

### Issue: Custom model accuracy too low

**Solution:**
1. Collect more training data (aim for 100K+ images)
2. Use data augmentation
3. Fine-tune with user feedback
4. Lower confidence threshold for API fallback

### Issue: Too many API fallbacks

**Solution:**
1. Retrain model with difficult cases
2. Adjust confidence thresholds
3. Add more training data for common species
4. Implement active learning

### Issue: Server downtime

**Solution:**
1. Set up automatic fallback to APIs if server is down
2. Implement health checks
3. Add retry logic
4. Consider redundant servers

---

## Conclusion

The hybrid strategy gives you:

✅ **Lowest cost:** $15-20/month for 10K identifications  
✅ **High accuracy:** Specialized APIs for difficult cases  
✅ **Full control:** Own your core technology  
✅ **Scalable:** Costs grow slowly with volume  
✅ **Offline capable:** Works without internet  

**This is the optimal long-term solution for your startup.**

---

**Next Steps:**
1. Read [Self_Hosted_Training.md](./Self_Hosted_Training.md) to train your model
2. Implement the routing logic shown above
3. Deploy and monitor performance
4. Iterate based on user feedback

---

**Document prepared by:** Manus AI  
**Date:** November 2, 2025

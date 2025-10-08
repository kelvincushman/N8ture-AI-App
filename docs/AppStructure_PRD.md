Product Requirements Document (PRD)
KAppMaker AI Integration Migration: Replicate to Google Gemini API
1. Executive Summary
1.1 Overview
Migrate KAppMakerExtended's AI integration from third-party Replicate API to direct Google Gemini API integration, providing more direct API access, reduced latency, better cost control, and enhanced capabilities.

1.2 Current State
Current Provider: Replicate API (third-party intermediary)
Backend: Firebase Cloud Functions (JavaScript)
Location: functions/api/replicate.js
Features: Text generation, image analysis using various open-source models
Limitations: Third-party dependency, indirect access, potential reliability issues
1.3 Desired State
New Provider: Google Gemini API (direct integration)
Backend: Firebase Cloud Functions (JavaScript)
Location: functions/api/gemini.js
Features: Text generation, image generation, multimodal input, chat capabilities, embeddings
Benefits: Direct API access, Google ecosystem integration, better pricing, improved reliability
2. Problem Statement
2.1 Current Pain Points
Third-Party Dependency: Reliance on Replicate as intermediary adds latency and potential points of failure
Indirect API Access: Cannot leverage full capabilities of underlying models directly
Cost Efficiency: Additional markup from third-party provider
Rate Limiting: Subject to both Replicate's and underlying model's rate limits
Integration Complexity: Managing multiple API specifications through a proxy
Limited Control: Cannot directly configure model parameters and settings
2.2 Opportunity
Google Gemini API offers:

Direct access to Google's AI models
Multiple model tiers (2.5 Pro, 2.5 Flash, 2.5 Flash-Lite)
Multimodal capabilities (text, image, video, audio input)
Generous free tier with clear pricing
Better integration with Google Cloud ecosystem
Official SDKs and comprehensive documentation
3. Goals and Objectives
3.1 Primary Goals
Replace Replicate API calls with direct Gemini API integration
Maintain existing KAppMaker AI functionality
Improve response times and reliability
Reduce operational costs
Enable future multimodal feature expansion
3.2 Success Metrics
Performance: Reduce average API response time by 30%
Reliability: Achieve 99.5% uptime for AI features
Cost: Reduce AI API costs by 25%
Developer Experience: Maintain backward compatibility for existing implementations
User Experience: No degradation in AI feature quality
3.3 Non-Goals (Out of Scope)
Implementing actual AI functionality (focus on architecture and integration only)
Migrating to different backend infrastructure (stay with Firebase Cloud Functions)
UI/UX changes to mobile application
Adding new AI features beyond current capabilities
4. Architecture Overview
4.1 Current Architecture
Mobile App (Kotlin Multiplatform) ↓ (HTTP/HTTPS) Firebase Cloud Functions ↓ (API Call) Replicate API ↓ Various Open Source Models
4.2 Target Architecture
Mobile App (Kotlin Multiplatform) ↓ (HTTP/HTTPS) Firebase Cloud Functions ↓ (Direct REST API) Google Gemini API ↓ Gemini Models (2.5 Pro/Flash/Flash-Lite)
4.3 Integration Points
Mobile Client (composeApp/src/commonMain/)

No changes to existing API call interfaces
Maintains existing request/response structure
Firebase Functions (functions/)

New file: api/gemini.js
Replace: Replicate-specific functions with Gemini equivalents
Maintain: Same function signatures and response formats
Configuration (util/Constants)

Add: GEMINI_API_KEY environment variable
Add: GEMINI_API_URL configuration
Maintain: Existing configuration structure
5. Technical Requirements
5.1 Backend Requirements (Firebase Cloud Functions)
5.1.1 New Module Structure
Create functions/api/gemini.js with the following exports:

// Core Functions
exports.geminiGenerateText = async (request, response) => {}
exports.geminiGenerateImage = async (request, response) => {}
exports.geminiAnalyzeImage = async (request, response) => {}
exports.geminiChat = async (request, response) => {}
exports.geminiStreamText = async (request, response) => {}
5.1.2 Configuration Management
File: functions/index.js

Required configurations:

GEMINI_API_KEY - Stored in Google Cloud Secret Manager
GEMINI_BASE_URL - https://generativelanguage.googleapis.com/v1beta/models/
DEFAULT_MODEL - gemini-2.5-flash (configurable)
MAX_TOKENS - Default: 8192
TEMPERATURE - Default: 0.7
5.1.3 API Endpoint Structure
Base URL Pattern:

https://[CLOUD_FUNCTIONS_URL]/[FUNCTION_NAME]
Required Endpoints:

/geminiGenerateText - Text generation from text prompt
/geminiGenerateImage - Image generation from text prompt
/geminiAnalyzeImage - Multimodal analysis (image + text)
/geminiChat - Multi-turn conversation
/geminiStreamText - Streaming text generation
5.1.4 Request/Response Format
Standard Request:

{
  "model": "gemini-2.5-flash",
  "prompt": "string",
  "temperature": 0.7,
  "maxTokens": 2048,
  "options": {}
}
Standard Response:

{
  "success": true,
  "data": {
    "text": "string",
    "metadata": {}
  },
  "error": null
}
Error Response:

{
  "success": false,
  "data": null,
  "error": {
    "code": "string",
    "message": "string"
  }
}
5.2 API Key Management
5.2.1 Obtaining API Keys
Visit https://ai.google.dev/
Click "Get API key"
Create new project or select existing
Generate API key with appropriate restrictions
5.2.2 Key Storage
Method: Google Cloud Secret Manager

Secret Name: GEMINI_API_KEY
Access: Cloud Function service account only
Rotation: Every 90 days (recommended)
Configuration File: functions/config.js

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

exports.getGeminiApiKey = async () => {
  // Implementation details omitted
};
5.3 Model Selection Strategy
5.3.1 Available Models
Gemini 2.5 Pro

Use Case: Complex reasoning, long context tasks
Context Window: 1M tokens
Cost: Higher
Gemini 2.5 Flash (Default)

Use Case: Balanced performance and cost
Context Window: 1M tokens
Cost: Medium
Gemini 2.5 Flash-Lite

Use Case: High-frequency, simple tasks
Context Window: 1M tokens
Cost: Lower
5.3.2 Selection Logic
function selectModel(options) {
  if (options.complexity === 'high') return 'gemini-2.5-pro';
  if (options.frequency === 'high') return 'gemini-2.5-flash-lite';
  return 'gemini-2.5-flash'; // Default
}
5.4 Error Handling
5.4.1 Error Categories
Authentication Errors (401)

Invalid API key
Expired API key
Rate Limit Errors (429)

Exceeded requests per minute
Exceeded daily quota
Invalid Request Errors (400)

Malformed request body
Invalid parameters
Server Errors (500)

Gemini API downtime
Network issues
5.4.2 Retry Strategy
const retryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableStatusCodes: [429, 500, 502, 503, 504]
};
5.5 Rate Limiting & Quotas
5.5.1 Client-Side Rate Limiting
Implement request throttling in Cloud Functions:

Free Tier: 15 requests per minute
Paid Tier: 1000 requests per minute (configurable)
5.5.2 Queue Management
Implement request queue for burst traffic
Return 429 with retry-after header when queue full
6. Migration Strategy
6.1 Migration Phases
Phase 1: Preparation (Week 1)
[ ] Set up Gemini API account
[ ] Generate and configure API keys in Secret Manager
[ ] Create functions/api/gemini.js file structure
[ ] Document current Replicate API usage patterns
Phase 2: Implementation (Week 2-3)
[ ] Implement core Gemini API wrapper functions
[ ] Add error handling and retry logic
[ ] Implement request/response transformation layers
[ ] Write unit tests for all functions
[ ] Set up monitoring and logging
Phase 3: Testing (Week 4)
[ ] Deploy to development environment
[ ] Run integration tests
[ ] Performance testing and benchmarking
[ ] Load testing for rate limits
[ ] Security audit
Phase 4: Gradual Rollout (Week 5-6)
[ ] Deploy to production with feature flag
[ ] Route 10% of traffic to Gemini API
[ ] Monitor metrics and errors
[ ] Increase to 50% if stable
[ ] Complete migration to 100%
Phase 5: Cleanup (Week 7)
[ ] Remove Replicate API dependencies
[ ] Update documentation
[ ] Remove feature flags
[ ] Archive legacy code
6.2 Rollback Plan
Maintain Replicate integration as fallback for 30 days
Feature flag to instantly switch back if needed
Automated health checks to trigger rollback
7. File Structure Changes
7.1 New Files
functions/ ├── api/ │ └── gemini.js # NEW: Gemini API integration ├── config/ │ └── gemini.config.js # NEW: Gemini-specific configuration ├── utils/ │ └── gemini.helper.js # NEW: Helper functions └── tests/ └── gemini.test.js # NEW: Test suite
7.2 Modified Files
functions/ ├── index.js # UPDATE: Export new Gemini functions ├── util/Constants.js # UPDATE: Add Gemini constants └── package.json # UPDATE: Dependencies
7.3 Files to Deprecate
functions/ └── api/ └── replicate.js # DEPRECATE: After successful migration
8. Configuration Requirements
8.1 Environment Variables
Development:

GEMINI_API_KEY=your_dev_api_key
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
DEFAULT_MODEL=gemini-2.5-flash
ENABLE_STREAMING=true
LOG_LEVEL=debug
Production:

GEMINI_API_KEY=[from Secret Manager]
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
DEFAULT_MODEL=gemini-2.5-flash
ENABLE_STREAMING=true
LOG_LEVEL=info
8.2 Firebase Configuration
functions/firebase.json:

{
  "functions": {
    "source": "functions",
    "runtime": "nodejs18",
    "region": "us-central1",
    "timeout": 60,
    "memory": "512MB",
    "environmentVariables": {
      "GEMINI_BASE_URL": "https://generativelanguage.googleapis.com/v1beta"
    }
  }
}
9. Security Considerations
9.1 API Key Security
Never expose API keys in client-side code
Use Google Cloud Secret Manager for key storage
Implement key rotation policy (90 days)
Set up API key restrictions (HTTP referrers, IP addresses)
9.2 Request Validation
Validate all input parameters on server side
Implement request size limits
Sanitize user-provided prompts
Rate limit by user/device ID
9.3 Response Filtering
Implement content safety checks
Filter sensitive information from responses
Log and monitor for abuse patterns
10. Monitoring and Observability
10.1 Metrics to Track
Request count per endpoint
Average response time
Error rate by type
API quota usage
Cost per request
Model performance metrics
10.2 Logging Requirements
Log all API requests (sanitized)
Log errors with full context
Performance metrics per request
User journey tracking
10.3 Alerting
Alert on error rate > 5%
Alert on response time > 5s
Alert on quota approaching limit (80%)
Alert on authentication failures
11. Testing Requirements
11.1 Unit Tests
Test each Gemini function independently
Mock Gemini API responses
Test error handling paths
Test retry logic
11.2 Integration Tests
End-to-end request flow
Authentication flow
Error scenarios
Rate limiting behavior
11.3 Performance Tests
Latency benchmarks
Load testing (1000 concurrent requests)
Memory usage profiling
Stress testing
12. Documentation Requirements
12.1 Developer Documentation
API endpoint reference
Request/response examples
Error code reference
Migration guide from Replicate
12.2 Operations Documentation
Deployment procedures
Monitoring dashboards setup
Troubleshooting guide
Rollback procedures
12.3 Code Documentation
JSDoc comments for all functions
Inline comments for complex logic
README for integration setup
Configuration guide
13. Dependencies
13.1 NPM Packages (package.json)
{
  "dependencies": {
    "firebase-functions": "^4.x",
    "firebase-admin": "^11.x",
    "@google-cloud/secret-manager": "^4.x",
    "axios": "^1.x",
    "node-cache": "^5.x"
  },
  "devDependencies": {
    "jest": "^29.x",
    "supertest": "^6.x"
  }
}
13.2 Google Cloud Services
Firebase Cloud Functions
Google Cloud Secret Manager
Cloud Logging
Cloud Monitoring
14. Cost Analysis
14.1 Gemini API Pricing (Estimated)
Free Tier:

15 RPM (requests per minute)
1 million TPM (tokens per minute)
1,500 RPD (requests per day)
Paid Tier (Flash model):

$0.075 per 1M input tokens
$0.30 per 1M output tokens
14.2 Cost Comparison
Assuming 100,000 requests/month:

Replicate: Variable pricing + markup
Gemini Direct: Predictable, generally lower cost
Estimated Savings: 25-40%
15. Risk Assessment
15.1 Technical Risks
| Risk | Impact | Probability | Mitigation | |------|--------|-------------|------------| | API instability | High | Low | Implement robust retry logic | | Rate limiting | Medium | Medium | Implement queuing system | | Breaking API changes | High | Low | Pin API version, monitor changelog | | Performance degradation | Medium | Low | Comprehensive testing, gradual rollout |

15.2 Business Risks
| Risk | Impact | Probability | Mitigation | |------|--------|-------------|------------| | User disruption | High | Low | Gradual rollout, feature flags | | Cost overrun | Medium | Low | Implement usage monitoring | | Vendor lock-in | Medium | Medium | Abstract API layer, maintain interfaces |

16. Success Criteria
16.1 Launch Criteria
[ ] All unit tests passing (100% coverage)
[ ] Integration tests passing
[ ] Performance benchmarks meet targets
[ ] Security audit completed
[ ] Documentation completed
[ ] Rollback procedure tested
16.2 Post-Launch Metrics (30 days)
Average response time < 2 seconds
Error rate < 1%
Cost reduction > 20%
Zero security incidents
User satisfaction maintained or improved
17. Timeline
| Phase | Duration | Deliverables | |-------|----------|--------------| | Preparation | 1 week | Setup, documentation | | Implementation | 2 weeks | Core functions, tests | | Testing | 1 week | All tests passed | | Gradual Rollout | 2 weeks | Production migration | | Cleanup | 1 week | Documentation, deprecation | | Total | 7 weeks | Complete migration |

18. Stakeholders
Development Team: Implementation and testing
DevOps Team: Deployment and monitoring setup
Product Team: Feature validation
QA Team: Testing and validation
Security Team: Security audit
19. Open Questions
Should we implement streaming responses for better UX?
What is the acceptable cost increase threshold?
Should we support multiple AI providers simultaneously?
Do we need to implement caching for common requests?
Should we add analytics for AI usage patterns?
20. Appendices
Appendix A: Gemini API Endpoints Reference
Text Generation: POST /models/{model}:generateContent
Streaming: POST /models/{model}:streamGenerateContent
Embeddings: POST /models/{model}:embedContent
Token Counting: POST /models/{model}:countTokens
Appendix B: Response Structure Examples
See Gemini API documentation for detailed examples.

Appendix C: Error Code Reference
See documentation for complete error code mapping.

Document Version: 1.0
Last Updated: 2025-09-30
Author: Product Team
Status: Ready for Review




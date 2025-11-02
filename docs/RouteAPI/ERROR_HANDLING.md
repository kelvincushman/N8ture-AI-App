# Error Handling

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

This document outlines the error handling strategy for the N8ture Route API.

## Error Response Format

Errors are returned with a `4xx` or `5xx` status code and a standard JSON body:

```json
{
  "success": false,
  "error": "error-code",
  "message": "A user-friendly explanation of the error."
}
```

## Common Error Codes

| Error Code | HTTP Status | Meaning & Recommended Action |
| :--- | :--- | :--- |
| `unauthenticated` | 401 | The user is not signed in. **Action:** Prompt to log in. |
| `not-found` | 404 | The requested trail or resource does not exist. **Action:** Display a "Trail not found" message. |
| `invalid-location` | 400 | The provided latitude/longitude is invalid. **Action:** Request valid location data. |
| `no-trails-found` | 404 | The search returned no results. **Action:** Inform the user and suggest broadening their search criteria. |
| `service-unavailable` | 503 | The routing or weather service is temporarily down. **Action:** Ask the user to try again later. |
| `internal-error` | 500 | An unexpected server error occurred. **Action:** Show a generic error message and log the details. |


# Error Handling

**Version:** 1.0  
**Author:** N8ture AI Team  
**Date:** October 26, 2025

---

## Introduction

This document provides a comprehensive guide to handling errors from the N8ture Identification API. A robust error handling strategy is crucial for providing a good user experience.

## Error Response Format

When an error occurs, the API will return a `4xx` or `5xx` status code and a JSON body with the following format:

```json
{
  "success": false,
  "error": "error-code",
  "message": "A user-friendly explanation of the error."
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `success` | `boolean` | Always `false` for errors. |
| `error` | `string` | A machine-readable error code. |
| `message` | `string` | A human-readable message suitable for display to the user. |

## Common Error Codes

Here is a list of common error codes and their meanings. The `identificationService.ts` already maps many of these to user-friendly messages.

| Error Code | HTTP Status | Meaning & Recommended Action |
| :--- | :--- | :--- |
| `unauthenticated` | 401 | The user is not signed in. **Action:** Prompt the user to log in or sign up. |
| `permission-denied` | 403 | The user does not have permission to access this resource. **Action:** This should rarely happen in production. Log the error for investigation. |
| `invalid-argument` | 400 | The request is malformed (e.g., missing `imageBase64`). **Action:** Ensure the request is correctly formatted. This is usually a client-side bug. |
| `quota-exceeded` | 429 | The user has exceeded their daily identification limit. **Action:** Display the paywall and prompt the user to upgrade to a premium plan. |
| `timeout` | 504 | The request to the AI model timed out. **Action:** Ask the user to check their internet connection and try again. |
| `deadline-exceeded` | 504 | Similar to `timeout`. **Action:** Ask the user to try again. |
| `unavailable` | 503 | The identification service is temporarily unavailable. **Action:** Ask the user to try again in a few minutes. |
| `internal` | 500 | An unexpected server error occurred. **Action:** Display a generic error message and log the full error for debugging. |
| `network-error` | - | A client-side network error occurred. **Action:** Ask the user to check their internet connection. |

## Client-Side Error Handling

The `identifySpecies` function in `identificationService.ts` includes a `try...catch` block that handles common errors and throws user-friendly `Error` objects. Your UI code should catch these errors and display them to the user, for example, in an `Alert`.

**Example from `identificationService.ts`:**

```typescript
} catch (error: any) {
  console.error("Error in identifySpecies:", error);

  // Map common errors to user-friendly messages
  if (error.message.includes("unauthenticated")) {
    throw new Error("Please sign in to use species identification.");
  } else if (error.message.includes("quota")) {
    throw new Error("API quota exceeded. Please upgrade to Premium for unlimited identifications.");
  } else if (error.message.includes("timeout")) {
    throw new Error("Request timed out. Please check your connection and try again.");
  }

  // Rethrow original error if not handled
  throw error;
}
```

**Example UI Implementation:**

```typescript
} catch (error: any) {
  Alert.alert("Identification Failed", error.message || "An unknown error occurred.");
}
```

## Best Practices for Error Handling

1.  **Always Show User-Friendly Messages:** Never display raw technical errors (e.g., stack traces) to the user.
2.  **Provide Actionable Advice:** Tell the user what they can do next (e.g., "Check your connection," "Try again later," "Upgrade to Premium").
3.  **Log Errors for Debugging:** Use a logging service (like Sentry or Firebase Crashlytics) to log the full technical error details for your development team.
4.  **Handle Network Issues Gracefully:** Detect when the user is offline and prevent them from making API calls. Provide a clear "You are offline" message.
5.  **Implement Retries for Transient Errors:** For errors like `timeout` or `unavailable`, consider implementing a simple retry mechanism with exponential backoff.


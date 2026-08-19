# ATIDETO Certificate System

Standalone certificate-generation service for the Atideto internship management system.
Generates branded PDF + PNG certificates with QR codes and hosts the public verification API.

## Structure

```
certificate-system/
├── service/    # @atideto/certificate-service — Puppeteer PDF/PNG engine + QR + certificate ID generator
├── backend/    # Express JSON API (:4000) — generate/verify/revoke + Firebase Storage/Firestore persistence
└── frontend/   # Static preview app (development only)
```

The main Atideto backend (`Atideto_official/backend`) calls this API over HTTP with a shared
`x-api-key`. The two systems are decoupled: the main backend sends the full candidate payload
inline, so this service does not need access to MongoDB.

## Requirements

- Node.js 18+
- Chrome (Puppeteer installs its own via `npm install` in `service/`)
- (Recommended) Google service account JSON for Firestore + Storage
- (Optional) Google Cloud Storage bucket for PDF/PNG persistence

## Setup

```sh
cd backend
cp .env.example .env    # set API_KEY to match the main backend's CERTIFICATE_SERVICE_SECRET
npm install             # installs express + links @atideto/certificate-service (file:../service)
npm start               # runs on :4000
```

If `backend/service-account.json` is present, Firebase Admin initializes with it. Otherwise the
service falls back to local JSON files (`data_certificates.json`, `data_students.json`) and
base64 data-URL storage.

## API

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/health` | GET | public | Health check |
| `/api/certificates/generate` | POST | `x-api-key` | Generate PDF+PNG+QR, store, return record |
| `/api/certificates/verify/:id` | GET | public | Return sanitized certificate data |
| `/api/certificates/:id/download` | GET | public | Redirect to the PDF URL |
| `/api/certificates/revoke/:id` | POST | `x-api-key` | Flip status to `revoked` (record kept) |
| `/api/offer-letters/*` | – | – | Offer-letter endpoints |
| `/api/admin/*` | – | `x-api-key` | Admin endpoints |

### Generate request

```jsonc
{
  "studentId": "ATI-INT-2026-000001",          // optional
  "student": {                                  // inline payload (preferred from main backend)
    "name": "Test Candidate",
    "email": "candidate@example.com",
    "college": "Test University",
    "registerNo": "REG123",
    "programTitle": "Java Full Stack Development",
    "selectedCourse": "Java Full Stack",
    "startDate": "2026-07-01",
    "endDate": "2026-08-31",
    "duration": "60"
  },
  "verificationUrl": "https://atideto.in/verify"  // overrides VERIFICATION_BASE_URL
}
```

## Certificate ID format

`AT-IC-{CODE}-{YEAR}-{SEQ}` (e.g. `AT-IC-GEN-2026-41FA64`). The suffix is
`crypto.randomBytes(3)` hex — not user-controlled.

## Storage

- Firebase Storage bucket: `certificates/{certificateId}.pdf` / `.png` (made public).
- If the bucket is missing/disabled, the service falls back to base64 data URLs embedded in
  the record — functional but heavy. **Enable Firestore + create the Storage bucket in the
  `atideto-certificate` GCP project before production.**

## Verification flow

The QR code on each certificate encodes `{verificationUrl}/{certificateId}`. The public
verification page (main website `/verify/:id`) queries the main backend, which reads its MongoDB
mirror. This service also exposes `/api/certificates/verify/:id` for direct checks.

## Troubleshooting

- `Cannot find package '@atideto/certificate-service'` — run `npm install` inside `backend/`.
- `Navigation timeout of 15000 ms exceeded` — cold Chrome start; the service uses a 60s
  navigation timeout. Retry or ensure the host has enough memory.
- `The specified bucket does not exist` — create `{project}.appspot.com` bucket (or set a
  custom bucket) in Google Cloud.
- Firestore `PERMISSION_DENIED` — enable the Cloud Firestore API for the project.

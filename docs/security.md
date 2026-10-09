# Threat Model and Security Profile: Quran Academy

This document outlines the assets, actors, trust boundaries, and abuse cases for the Quran Academy application, with a strong focus on child safety and data protection as per Phase 11 of the master prompt.

## 1. Assets
- **Children's Data:** PII, recording streams, progress notes, chat logs.
- **Teacher Data:** Government IDs (CNIC, Passports), Bank account numbers (IBAN), phone numbers, home addresses, compensation records.
- **Parent/Billing Data:** Payment tokens, invoices, billing addresses.
- **Academy IP:** Licensed content, curriculum, pricing logic.

## 2. Actors
- **Student (Minor):** Cannot access billing, cannot view teacher contact info, cannot private message.
- **Guardian/Parent:** Manages billing, grants/revokes recording consent, can silently observe classes.
- **Teacher:** Conducts classes, writes notes. Cannot view student emails/phones, cannot download recordings without audit.
- **Admin (Operations/Accounts/Super):** Highest privilege. Accounts role reveals masked bank data. SuperAdmin can audit all logs.

## 3. Trust Boundaries
- **Client (Browser/PWA) to Next.js Edge:** Unverified. All input passes through Zod validation.
- **Next.js Edge to Supabase (Postgres):** Verified via RLS and JWTs.
- **Client to LiveKit:** Short-lived tokens. Students cannot publish audio without token grants.
- **Webhooks (Stripe/Payment):** Verified via cryptographic signatures.

## 4. Abuse Cases & Mitigations
### A. Child Safety & Grooming
- **Threat:** Teacher attempts to contact a student outside the platform.
- **Mitigation:** Strict hiding of student PII from teachers. All in-class chat is logged and searchable.

### B. Unauthorized Recording
- **Threat:** Someone records a minor without parental consent.
- **Mitigation:** The application server checks the `consents` table before minting a LiveKit token. The `Recording consented` badge is explicitly driven by server state.

### C. IDOR / Broken Object Level Authorization
- **Threat:** A parent changes an invoice ID in the URL to view another family's invoice.
- **Mitigation:** RLS policy on `invoices` table enforces `auth.uid() = parent_id`.

### D. Server-Side Template Injection (SSTI)
- **Threat:** Admin creates a notification template containing execution code.
- **Mitigation:** Notification engine uses simple regex string substitution (`{{name}}`), completely avoiding `eval` or rich template engines.

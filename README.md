<div align="center">

  <!-- Replace the placeholder below with your project banner image URL. -->
  <img src="https://ik.imagekit.io/tvaz27dnm/pulsecare_banner?updatedAt=1792050710315" alt="PulseCare project banner" width="100%" />

  <br />

  <p>
    <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=next.js&color=black" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=blue" alt="React 19" />
    <img src="https://img.shields.io/badge/Appwrite-Cloud%20Backend-F02E65?style=for-the-badge&logo=appwrite&logoColor=reddish" alt="Appwrite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=blue" alt="Tailwind CSS 4" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=blue" alt="TypeScript 5" />
    <br />
    <img src="https://img.shields.io/badge/React_Hook_Form-Forms-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form" />
    <img src="https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=blue" alt="Zod" />
    <img src="https://img.shields.io/badge/shadcn%2Fui-Components-000000?style=for-the-badge&logo=shadcnui&logoColor=black" alt="shadcn/ui" />
  </p>
</div>

---

# ✨PulseCare

**PulseCare** is a patient registration and appointment management app for a medical practice. Patients can submit their information and request appointments, while authorized staff manage appointment status from a protected dashboard.

## Table of Contents

1. [🌟 Introduction](#introduction)
2. [🛠 Tech Stack](#tech-stack)
3. [🧩 Features](#features)
4. [🚀 Quick Start](#quick-start)
5. [🔑 Environment Variables](#environment-variables)
6. [🧑‍💻 Appwrite Setup](#appwrite-setup)
7. [📐 Available Commands](#available-commands)
8. [📜 License](#license)

---

## 🌟 Introduction

PulseCare provides a responsive workflow for patient onboarding and appointment requests, along with tools for authorized staff to review and manage appointments. Patient documents are stored in Appwrite Storage, appointment and patient data are managed through Appwrite, and status updates can be sent by SMS through Appwrite Messaging.

## 🛠 Tech Stack

- **[Next.js 16](https://nextjs.org/)** and **[React 19](https://react.dev/)**: App Router foundation for the application UI and server-side features.
- **[TypeScript](https://www.typescriptlang.org/)**: Static typing across application code and data models.
- **[Appwrite](https://appwrite.io/)**: Authentication, database tables, file storage, and SMS messaging.
- **[Tailwind CSS 4](https://tailwindcss.com/)** and **[shadcn/ui](https://ui.shadcn.com/)**: Styling and reusable interface components built on Radix UI.
- **[React Hook Form](https://react-hook-form.com/)** and **[Zod](https://zod.dev/)**: Form state management and schema validation.
- **[TanStack Table](https://tanstack.com/table)**: Appointment table and sorting.
- **[Sentry](https://sentry.io/)**: Error monitoring.
- **[Framer Motion](https://motion.dev/)**, **[Lucide React](https://lucide.dev/)**, and **[Sonner](https://sonner.emilkowal.ski/)**: Animation, icons, and notifications.

## 🧩 Features

- Patient onboarding with contact, demographic, insurance, and medical history forms.
- Identification document upload to Appwrite Storage.
- Appointment requests with physician selection and scheduling details.
- Protected staff dashboard with appointment status counts and a sortable table.
- Appointment scheduling and cancellation, with SMS notifications through Appwrite Messaging.
- Role-based access for super-admins, staff, doctors, and patients.
- Responsive UI, form validation, offline/network error states, and Sentry error monitoring.

## 🚀 Quick Start

### Requirements

- Node.js compatible with the installed Next.js version.
- npm.
- An Appwrite project configured with the required database, tables, storage bucket, and messaging service.

### Install and run

```bash
git clone <repository-url>
cd pulsecare
npm install
```

Create a `.env.local` file in the project root and configure the variables listed below. Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔑Environment Variables

| Variable                    | Purpose                                                                      |
| --------------------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_ENDPOINT`      | Appwrite API endpoint, for example `https://cloud.appwrite.io/v1`.           |
| `PROJECT_ID`                | Appwrite project ID.                                                         |
| `API_KEY`                   | Server API key with only the permissions this app requires. Keep it private. |
| `DATABASE_ID`               | Appwrite database ID.                                                        |
| `PATIENT_COLLECTION_ID`     | Appwrite table ID for patient profiles.                                      |
| `DOCTOR_COLLECTION_ID`      | Appwrite table ID for doctor records.                                        |
| `APPOINTMENT_COLLECTION_ID` | Appwrite table ID for appointments.                                          |
| `NEXT_PUBLIC_BUCKET_ID`     | Appwrite Storage bucket ID for patient identification documents.             |
| `DB_NAME`                   | Database name setting read by the app configuration.                         |
| `NEXT_PUBLIC_SENTRY_DSN`    | Optional Sentry DSN for client-side error monitoring.                        |
| `SENTRY_AUTH_TOKEN`         | Optional Sentry auth token used during builds to upload source maps.         |

Example `.env.local` (replace each value with your own Appwrite and Sentry configuration):

```env
NEXT_PUBLIC_ENDPOINT=https://cloud.appwrite.io/v1
PROJECT_ID=
API_KEY=
DATABASE_ID=
PATIENT_COLLECTION_ID=
DOCTOR_COLLECTION_ID=
APPOINTMENT_COLLECTION_ID=
NEXT_PUBLIC_BUCKET_ID=
DB_NAME=

# Optional Sentry configuration
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

## 🧑‍💻 Appwrite Setup

Configure the Appwrite project before running the application:

1. Create a database and patient, doctor, and appointment tables. Set their IDs in the matching environment variables.
2. Create a Storage bucket for identification documents and set its ID as `NEXT_PUBLIC_BUCKET_ID`.
3. Configure table columns and relationships to match the records used by the app. Patient records include the user's Appwrite ID, contact and profile details, medical history, insurance details, and document metadata. Appointment records include the patient relationship, owning user ID, physician, requested schedule, reason, note, and status (`pending`, `scheduled`, or `cancelled`).
4. Set table and bucket permissions for the server API key. The app performs role and ownership checks in server actions. Keep the API key server-side and do not grant it to browsers.
5. Create staff accounts in Appwrite. Assign privileged role labels (`super-admin`, `staff`, or `doctor`) in the Appwrite Console. Accounts without a privileged role are treated as patients.
6. Enable and configure Appwrite Messaging, and ensure patient accounts can receive SMS if appointment status messages should be delivered.

The staff sign-in form is available from the **Admin** link on the home page (`/?admin=true`).

## Available Commands

```bash
npm run dev    # Start the local development server
npm run build  # Create a production build
npm run start  # Start the production server
npm run lint   # Run ESLint
```

## 📜License

This project is licensed under the [MIT License](LICENSE). You may use, modify, and distribute the software subject to its terms.

# Falcon Remote Desktop Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Rithvik-krishna/Falcon)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Android%20%7C%20iOS-blue)](https://github.com/Rithvik-krishna/Falcon)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Falcon** is a secure, low-latency, cross-platform remote desktop solution designed to provide a consumer-grade experience with enterprise-grade security. Built with a high-performance **Rust** Desktop Agent, **Flutter** Mobile Application, and stateless **Node.js (Fastify)** Cloud Infrastructure with WebRTC P2P media streaming.

---

## Technical Stack & Architecture Overview

```
                               ┌─────────────────────────────────────────┐
                               │               FALCON SDK                │
                               │  (Auth, Protocol, Crypto, Telemetry)   │
                               └────────────────────┬────────────────────┘
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 ▼                                  ▼                                  ▼
      ┌─────────────────────┐            ┌─────────────────────┐            ┌─────────────────────┐
      │   Backend Service   │            │    Desktop Agent    │            │     Mobile App      │
      │ (Fastify / REST v1) │            │ (Rust / Win32 / WS) │            │ (Flutter / Riverpod)│
      └─────────────────────┘            └─────────────────────┘            └─────────────────────┘
                 │                                  │                                  │
                 │ JSON over HTTP                   │ Protobuf over DataChannel        │ JSON over WS
                 ▼                                  ▼                                  ▼
      ┌───────────────────────────────────────────────────────────────────────────────────────────┐
      │                                   TRANSPORT PROTOCOL                                      │
      │  Header: [Version (1B)][Type (2B)][Length (4B)][Flags (1B)][Payload (Protobuf/JSON...)]   │
      └───────────────────────────────────────────────────────────────────────────────────────────┘
```

| Component | Technology Stack | Key Features |
| :--- | :--- | :--- |
| **Backend Services** | Node.js, Fastify 4, Prisma ORM, Pino, `ws`, Redis 7 | Enforces `/api/v1/` versioning, Argon2id password hashing, JWT access tokens + refresh token rotation, Redis token revocation blacklist, Native WebSocket signaling (`wss://<host>/ws/signaling`). |
| **Database & Cache** | PostgreSQL 16, Redis 7, MinIO/S3 | 10 Core tables (`users`, `devices`, `sessions`, `session_events`, `refresh_tokens`, `device_heartbeats`, `user_settings`, `audit_logs`, `notifications`, `file_transfers`). |
| **Core SDK (`falcon-sdk`)**| TypeScript & Rust (`crates/sdk`) | Shared 8-Byte Binary Protocol Header (`[Version: 1B][Type: 2B][Length: 4B][Flags: 1B]`), AES-256-GCM authenticated encryption, OTLP tracing headers. |
| **Desktop Agent** | Rust, Tauri v2, DXGI, WASAPI, Win32 `SendInput` | 12 Modular crates (`core`, `capture`, `encoder`, `audio`, `network`, `webrtc`, `input`, `clipboard`, `filetransfer`, `updates`, `telemetry`, `storage`), Windows DPAPI secret vault, `TaskScheduler`, `FalconPlugin` system. |
| **Mobile App** | Flutter (Dart 3), Riverpod, `flutter_webrtc` | Device dashboard, biometric authentication (`local_auth`), touch gesture decoding to Win32 inputs. |
| **Infrastructure** | Docker, Coturn, OpenTelemetry, Jaeger | Coturn STUN/TURN server, OpenTelemetry OTLP Collector, Jaeger distributed tracing UI. |

---

## Directory Structure

```
falcon/
├── backend/                      # Fastify REST v1 API & Native WebSocket Signaling
│   ├── prisma/                   # PostgreSQL Prisma ORM Schema & Migrations
│   └── src/
│       ├── api/v1/               # Versioned API routes & controllers
│       ├── config/               # ConfigService & Redis client
│       ├── middlewares/          # JWT Auth Middleware & Redis Blacklist
│       ├── modules/
│       │   ├── auth/             # Argon2id Auth Service & JWT Refresh Token Rotation
│       │   └── devices/          # Device Registry & 30s Heartbeat Monitor
│       ├── services/             # DomainEventBus & FeatureFlagService
│       ├── utils/                # Pino Logger & Argon2id Crypto
│       └── websocket/            # Native WebSocket (`ws`) Signaling Server
├── packages/sdk/                 # TypeScript Core Falcon SDK
│   └── src/                      # Header framing & AES-256-GCM Crypto
├── crates/sdk/                   # Rust Core Falcon SDK
│   └── src/                      # Header framing & Ring AES-256-GCM Crypto
├── config/                       # Coturn & OpenTelemetry Collector configurations
└── docker-compose.yml            # PostgreSQL, Redis, Coturn, OTLP Collector, Jaeger
```

---

## Development & Setup Guide

### Prerequisites
- **Node.js**: `v20.x` or higher
- **pnpm**: `v9.x` or higher (`npx pnpm`)
- **Rust**: `1.75.0` or higher (`cargo`)
- **Docker & Docker Compose**

### 1. Launch Cloud Infrastructure
Spin up PostgreSQL, Redis, Coturn STUN/TURN, OpenTelemetry Collector, and Jaeger:
```bash
docker-compose up -d
```

### 2. Install & Build Monorepo Workspaces
```bash
# Build TypeScript SDK
cd packages/sdk
npm install
npm run build

# Build Rust SDK
cd ../../crates/sdk
cargo test

# Setup Backend & Run Migrations
cd ../../backend
npm install
npm run build
```

### 3. Start Backend Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000` with native WebSocket signaling at `ws://localhost:3000/ws/signaling`.

---

## API & Protocol Documentation

### REST API v1 Endpoints

#### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Create user account (Argon2id password hashing).
- `POST /api/v1/auth/login` - Authenticate & receive short-lived JWT access token (15m) + refresh token (7d).
- `POST /api/v1/auth/refresh` - Rotate refresh token & receive new access token.
- `POST /api/v1/auth/logout` - Blacklist active access token in Redis & revoke refresh token.
- `GET /api/v1/auth/me` - Fetch authenticated user profile.

#### Device Registry (`/api/v1/devices`)
- `POST /api/v1/devices/register` - Register new desktop agent device with public key.
- `GET /api/v1/devices` - List registered devices with real-time status.
- `GET /api/v1/devices/:id` - Fetch device details.
- `PATCH /api/v1/devices/:id/settings` - Update device settings.
- `DELETE /api/v1/devices/:id` - Remove device registration.
- `POST /api/v1/devices/:id/heartbeat` - Record CPU, RAM, Disk metrics & update online status.

#### Feature Flags (`/api/v1/features`)
- `GET /api/v1/features` - Fetch active feature flag toggles (`featureAv1Codec`, `featureClipboardSync`, `featureFileTransfer`).

---

## Testing & Verification

### Run TypeScript SDK Unit Tests
```bash
cd packages/sdk
npm run test
```

### Run Rust SDK Unit Tests
```bash
cd crates/sdk
cargo test
```

### Run Backend Integration Tests
```bash
cd backend
npm run test
```

---

## License

This project is licensed under the [MIT License](LICENSE).

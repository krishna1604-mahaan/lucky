import { SampleProfile } from '../types.ts';

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'distributed-systems',
    label: 'Distributed Backend Intern',
    summary: 'B.S. CS · Go, Kafka, PostgreSQL · Cloud Systems',
    input: {
      candidateName: 'Maya Lin',
      degree: 'B.S. in Computer Science, Distributed Systems Concentration (Class of 2027)',
      skills: 'Go, Rust, TypeScript, PostgreSQL, Redis, Apache Kafka, Docker, Kubernetes, gRPC, Prometheus',
      projects:
        'Backend Engineering Intern at LatticePay (Summer 2026): Built an idempotent webhook delivery worker in Go and Kafka that processed 18k events/min and cut retry latency by 37%. Capstone Project: Implemented a Raft-based key-value store with log compaction and snapshotting in Rust.',
      companyName: 'Cloudflare',
      jobRole: 'Software Engineer Intern — Core Infrastructure',
      jobDescription:
        'We are looking for a Computer Science student to join our Core Infrastructure team. You will design high-throughput, fault-tolerant distributed services in Go and Rust, optimize telemetry ingestion pipelines, and collaborate on low-latency storage engines. Ideal candidates have hands-on experience with networked systems, concurrency, observability tooling, and relational or distributed databases.',
    },
  },
  {
    id: 'ml-systems',
    label: 'Applied ML Engineer (New Grad)',
    summary: 'M.S. ECE / ML · PyTorch, CUDA, FastAPI · Computer Vision',
    input: {
      candidateName: 'Arjun Patel',
      degree: 'M.S. in Electrical & Computer Engineering, Machine Learning Track (May 2027)',
      skills: 'Python, PyTorch, C++, CUDA, ONNX Runtime, FastAPI, Docker, Weights & Biases, Ray, SQL',
      projects:
        'ML Research Assistant at VisionLab: Quantized and compiled multimodal vision transformers using ONNX Runtime and TensorRT, reducing inference latency from 92ms to 29ms on edge GPUs. SWE Intern at MedScan AI: Deployed FastAPI inference microservices with batched async queues serving 400+ daily clinical imaging jobs.',
      companyName: 'Scale AI',
      jobRole: 'Machine Learning Engineer, New Grad',
      jobDescription:
        'Join our Applied ML Engineering group to build high-efficiency training, evaluation, and model serving pipelines. Responsibilities include optimizing PyTorch inference throughput, designing reproducible evaluation harnesses for vision and language models, and building clean Python/C++ backend services for enterprise customers.',
    },
  },
  {
    id: 'embedded-robotics',
    label: 'Embedded Firmware Co-op',
    summary: 'B.S. Computer Engineering · C, RTOS, SPI/I2C · Robotics',
    input: {
      candidateName: 'Elena Alvarez',
      degree: 'B.S. in Computer Engineering, Embedded Systems & Robotics Minor (2027)',
      skills: 'C, C++17, FreeRTOS, STM32, ARM Cortex-M, SPI, I2C, CAN bus, Python, Oscilloscope & Logic Analyzer debugging',
      projects:
        'Firmware Lead on Formula SAE Electric Team: Authored CAN-bus telemetry drivers and battery management state machines in C on STM32F4 under FreeRTOS, achieving deterministic 1kHz control loops. Hardware-Software Co-design Lab: Built an FPGA-accelerated PID motor controller with SPI sensor fusion.',
      companyName: 'Rivian',
      jobRole: 'Embedded Firmware Engineering Co-op',
      jobDescription:
        'Help develop low-level vehicle control firmware for next-generation electric platforms. You will write deterministic C/C++ drivers for ARM microcontrollers running RTOS, bring up new sensor boards using SPI/I2C/CAN protocols, and debug real-time timing issues using bench hardware and oscilloscopes.',
    },
  },
];

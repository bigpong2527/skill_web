# skills.rest — Open Agent Skills Registry

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

---

## Overview

**skills.rest** is a comprehensive, open directory and discovery platform for AI agent skills. It indexes over 750,000+ vetted, standardized executable skills designed to extend the procedural knowledge, operational toolsets, and workflow execution capabilities of modern AI coding assistants and autonomous agents.

Every skill listed on the platform adheres to an open specification (standardized `SKILL.md` instruction files accompanied by optional executable scripts and dependency requirements). The registry is 100% free, updated continuously, and organized to bridge the gap between high-level language models and deterministic task execution.

---

## What Can Visitors Do on skills.rest?

Whether you are a developer looking to supercharge your local AI coding assistant, a team designing autonomous agent workflows, or an open-source author publishing custom capabilities, the platform provides dedicated tooling and interactive discovery modules.

### 1. Search and Filter the Skills Catalog
- **Keyword & Natural Language Search**: Search across hundreds of thousands of skills using natural task descriptions, tool names, or technical domains (e.g., `pdf extraction`, `test-driven development`, `database migration`).
- **Multi-Dimensional Exploration (`/explore`)**:
  - **Category Filter**: Filter through 10 distinct professional domains.
  - **Origin Filter**: Toggle between **Official** skills published by verified technology organizations and **Community** contributions from independent developers.
  - **Complexity Ratings**: Narrow down skills by difficulty level (**Basic**, **Intermediate**, and **Advanced**).
- **Responsive Infinite Browsing**: Browse dense collections smoothly with persistent scroll-state memory that preserves your place when navigating back from skill detail pages.

### 2. Inspect In-Depth Skill Specifications
Each skill possesses a dedicated detail page (`/skill/[slug]`) providing all information required to evaluate and execute it safely:
- **System Documentation**: Clear breakdowns of what exact problem the skill solves, core feature lists, supported frameworks, and practical use cases.
- **Dependency & Requirement Checks**: Transparent identification of required command-line utilities, runtime binaries, API keys, or companion packages.
- **Verified Publisher Metadata**: View author credentials, repository stars, fork metrics, and direct links to source code and developer profiles.
- **Interactive FAQ Accordions**: Structured answers addressing common installation questions, compatibility boundaries, and usage patterns.
- **Contextual Recommendations**: Discover related and complementary skills within the same functional domain.

### 3. One-Click Installation & Structured Prompt Extraction
The platform eliminates manual configuration friction by generating standard installation scripts directly on each skill card and detail page:
- **Multi-Package-Manager Support**: Instantly toggle and copy commands tailored for your preferred package runner (`npx`, `pnpm dlx`, or `bunx`):
  ```bash
  npx skills add <repository-url> --skill <skill-slug>
  ```
- **Structured Prompts for Direct Agent Loading**: Copy structured, model-readable prompt blocks designed to be pasted directly into an active AI agent chat session, instructing the agent to inspect, retrieve, and load the skill autonomously.

### 4. Manage Suites and Batch Installations (`/best-skills` & `/repo/...`)
For projects requiring coordinated sets of capabilities, visitors can explore full repository suites:
- **Best Skills Hub (`/best-skills`)**: Discover market-validated, high-starred collections covering end-to-end disciplines such as UI/UX design systems, software refactoring, and data processing.
- **Repository Suite Pages (`/repo/[owner]/[name]`)**:
  - **Install-All Execution**: Generate bulk commands to install an entire suite globally with a single command (`--all -g -y`).
  - **Custom Multi-Select Mode**: Check individual skills from a suite to dynamically assemble a tailored installation command via a floating action dock.
  - **Agent Guide Prompts**: Extract rule prompts that teach agents how to merge new project guidelines without overwriting local configurations.

### 5. Enable Autonomous On-Demand Skill Discovery (`/skills-search-cli`)
Instead of searching manually on the web, developers can empower their AI agents to discover and install skills autonomously when encountering unfamiliar tasks:
- **Native Helper Tool**: Install a lightweight local helper (`skill-discovery`) into your agent's local environment. When your assistant needs a specialized workflow, it queries the registry API, presents the best candidate matches, and installs the chosen skill upon your approval.
- **Zero-Install Universal Agent Rules**: Copy standardized discovery instructions directly into your workspace instruction files (`AGENTS.md`, system prompts, or IDE configuration rules), establishing a universal discovery protocol across any compliant AI agent.

### 6. Browse the Organizations Directory (`/companies`)
- **Verified Technology Entities**: Browse hundreds of certified technology institutions, development teams, and official open-source foundations.
- **Ecosystem Classification**: Navigate organizations structured across technical sectors, including cloud infrastructure, artificial intelligence and model runtimes, developer tooling, security, and data analytics.
- **Author Profiles & Capability Distribution**: Examine organizational profiles complete with interactive SVG capability distribution charts illustrating their skill focus areas.

### 7. Submit Open-Source Skills (`/contribute`)
- **Community Contribution Portal**: Developers and maintainers can submit public Git repository links to be indexed.
- **Automated Scanning & Quality Verification**: Submitted repositories undergo automated inspection to verify `SKILL.md` format compliance, dependency declarations, and security safety before being made publicly searchable.

---

## Professional Workflow Domains

The registry categorizes skills across 10 specialized workflow domains:

| Category | Typical Use Cases & Capabilities |
|---|---|
| **Software Engineering** | Code generation, architectural migrations, automated refactoring, TDD workflows, CI/CD pipeline automation, and debugging. |
| **Data & Analytics** | Structured data extraction (SQL/CSV/JSON), table parsing, database performance tuning, and business intelligence reporting. |
| **Design & Creative** | Design system implementation, SVG asset generation, responsive UI layout audits, typography, and animation timing. |
| **Content & Communication** | Technical writing, changelog generation, documentation synchronization, and structured editorial drafting. |
| **Product & Management** | User story generation, backlog refinement, sprint release notes, roadmap synthesis, and issue tracking. |
| **Education & Research** | Academic paper summarization, LaTeX formula formatting, literature citation review, and study curriculum synthesis. |
| **Finance & Accounting** | Financial spreadsheet modeling, invoice parsing, budget reconciliations, and transactional auditing. |
| **Legal & Compliance** | Contract clause cross-referencing, license compliance audits, and regulatory requirement checklists. |
| **Marketing & Sales** | Structured metadata drafting, outreach copy design, and competitive product analysis. |
| **Personal & Entrepreneur** | Workflow automations, knowledge base linking, task management, and daily operational routines. |

---

## Security, Privacy, and Execution Principles

- **Local Execution**: All skills execute exclusively in your local development environment or designated agent sandbox. The registry does not execute untrusted user code on its servers.
- **Explicit User Consent**: Installation commands and automated search helpers require explicit confirmation before modifying local configurations or running terminal scripts.
- **Automated Security Ingestion Screening**: Every submitted skill is scanned for malicious command execution, unsafe remote scripts, and structural integrity prior to publication.
- **Zero Account Requirement**: The catalog is accessible and usable without mandatory registration, account creation, or proprietary paywalls.

---

## Getting Started

1. Visit [skills.rest](https://skills.rest) to search for your task or browse by category.
2. Select a skill to view its requirements and documentation.
3. Copy the installation command or prompt into your agent terminal or conversational workspace.
4. (Optional) Configure the [Skills Search CLI](https://skills.rest/skills-search-cli) to enable autonomous discovery for your agent workflows.

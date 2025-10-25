Aquí tienes un **template** en inglés para `CONTRIBUTING.md` adaptado para tu repositorio fg‑next‑draw‑canvas, inspirado en las pautas de GitHub. Puedes ajustarlo o ampliarlo según tus necesidades.

---

# Contributing to fg-next-draw-canvas

Thank you for your interest in contributing to **fg-next-draw-canvas**!
We welcome contributions of all kinds: bug reports, documentation improvements, feature requests, pull-requests, etc.
By participating in this project, you agree to abide by our code of conduct (see `CODE_OF_CONDUCT.md`).

## Table of Contents

1. [How to Contribute](#how-to-contribute)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Issue & Feature Request Guidelines](#issue--feature-request-guidelines)
5. [Pull Request Guidelines](#pull-request-guidelines)
6. [Code Style & Testing](#code-style--testing)
7. [Community & Communication](#community--communication)
8. [License](#license)

---

## How to Contribute

There are several ways you can contribute:

* Report bugs or suggest enhancements.
* Improve documentation or examples.
* Add new features or improve existing ones.
* Help with triaging issues and reviewing pull requests.
* Improve performance, architecture, or code quality.

Whether you’re opening a first issue or submitting a large complex feature, your contribution is appreciated!

---

## Getting Started

1. Fork the repository and clone it locally.

   ```bash
   git clone https://github.com/fabiangftech/fg-next-draw-canvas.git
   cd fg-next-draw-canvas
   ```
2. Install dependencies (if any) and set up the environment.
3. Create a new branch for your work:

   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes, ensuring all tests pass and linting/style checks are satisfied.
5. Commit your changes with a meaningful commit message and push your branch to your fork.
6. Open a pull request against the `main` branch in this repository.

---

## Development Workflow

* Commit to a **feature branch**, not directly to `main`.
* Keep your changes focused: one feature or bug at a time.
* Rebase or merge from `main` to keep your branch up to date before submitting the pull request.
* Squash and clean up your commits if needed (we prefer a clean commit history).
* Make sure all automated checks pass (build, tests, lint, etc.) before requesting review.

---

## Issue & Feature Request Guidelines

Before you file an issue or feature request, please check for duplicates.
Use the following guidelines to help us handle issues more efficiently:

### For Bug Reports

* Provide a **clear and descriptive title** (e.g. “Canvas flickers when resizing window on Chrome”).
* Explain the **behavior you expected** and the **behavior that actually occurred**.
* Include **steps to reproduce the issue**, and provide minimal code or a sandbox if possible.
* Mention which version of fg-next-draw-canvas you are using and any relevant environment details (device, OS, browser, etc.).

### For Feature Requests

* Use a clear **title** (e.g. “Add support for arrow keys navigation”).
* Describe **why** this feature would be useful and what benefit it would provide.
* Provide any **context, design mockups or API suggestions** if available.
* If possible, link any related issues or external discussions.

---

## Pull Request Guidelines

When submitting a PR, please follow these guidelines:

* Include a clear **title** and **description** of what your PR does.
* Reference the related issue (e.g. `Closes #123`).
* Ensure your code includes **tests** (unit/integration) if applicable.
* Document any changes to public APIs or behavior.
* Maintain **backward compatibility** unless there’s a strong reason to break it (and then clearly document the change).
* Run all tests and verify there are no regressions.
* Keep your PR focused and small; large PRs are harder to review.
* If your PR introduces performance changes, provide benchmarks or comparison data.
* Add or update documentation (README, examples) accordingly.

---

## Code Style & Testing

* We use consistent formatting and conventions (e.g., indent size, naming, comments).
* Please follow the existing style in the codebase.
* Write **unit and/or integration tests** for new features and bug fixes.
* Ensure that existing tests still pass locally before submitting.
* Where appropriate, consider adding benchmarks to validate performance improvements.

---

## Community & Communication

* Be respectful and inclusive in all interactions; see `CODE_OF_CONDUCT.md`.
* If you'd like to propose a large architectural change or new direction, open a discussion **before** coding.
* Use GitHub Discussions (or Issues) for open conversation about feature ideas, roadmap, and design.
* We appreciate early communication: share what you're working on so we can avoid duplicate efforts.

---

## License

By contributing, you agree that your contributions will be licensed under the project’s **MIT License** (or whichever license the project uses).
See the `LICENSE` file for details.

---

Thank you for helping make fg-next-draw-canvas better. Your contributions matter! 🚀

---

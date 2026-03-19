# Contributing to VCart

First off — thanks for taking the time to contribute! 🎉

Whether you're here to fix a bug, improve the docs, or suggest a new feature, all contributions are welcome.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Getting Started

1. **Fork** this repository
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/VCart.git
   cd VCart
   ```
3. Set the upstream remote:
   ```bash
   git remote add upstream https://github.com/VividhDesign/VCart.git
   ```
4. Follow the setup steps in [README.md](./README.md) to get the project running.

---

## Development Workflow

Always work on a **feature branch**, not directly on `main`:

```bash
git checkout -b feat/your-feature-name
```

Keep your branch up to date:

```bash
git fetch upstream
git rebase upstream/main
```

---

## Commit Message Convention

This project loosely follows [Conventional Commits](https://www.conventionalcommits.org/):

| Type       | When to use                                     |
|------------|-------------------------------------------------|
| `feat`     | A new feature                                   |
| `fix`      | A bug fix                                       |
| `style`    | CSS/UI changes that don't affect logic          |
| `refactor` | Code restructuring without adding features      |
| `docs`     | Documentation changes only                     |
| `chore`    | Build process, dependencies, config             |

**Examples:**

```
feat: add product image upload via Cloudinary
fix: cart quantity not persisting on refresh
style: improve mobile layout for checkout page
docs: update deployment instructions
```

Keep the subject line under 72 characters. Add a body if the change needs more context.

---

## Pull Request Guidelines

- **One feature/fix per PR** — keep it focused
- **Include a clear description** of what you changed and why
- **Test your changes** before submitting
- **Link any related issues** using `Closes #123` in the PR description
- PRs that break existing functionality will not be merged without a fix

---

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) when opening an issue.

Please include:
- Steps to reproduce
- Expected vs actual behavior
- Your OS and Node.js version
- Any relevant console errors

---

## Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) to propose new ideas.

Try to describe the **problem** you're trying to solve rather than jumping straight to a solution — often there's a simpler approach!

---

Thanks again for contributing to VCart. 🛒

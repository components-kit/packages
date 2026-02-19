# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-02-19

### Fixed

- Bin executable permission and path format so `ck` command registers correctly on install

## [0.1.0] - 2026-02-19

### Added

- Initial release of @components-kit/cli
- `ck init` command — scaffold a `components-kit.config.json` with default settings
- `ck generate` command — fetch variant definitions from the ComponentsKit API and emit a `.d.ts` augmentation file
- `--check` flag for CI/CD to verify types are up to date
- `--output` and `--api-url` CLI options to override config file settings

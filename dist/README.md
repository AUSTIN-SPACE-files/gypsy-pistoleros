# dist/

This directory contains generated deployment bundles.

Files here are **not source** — they are built from the `/css` source files
and should not be edited directly.

## Regenerate

Run from the project root:

```
./scripts/build-v0-bundle.sh
```

## Contents

| File | Source | Destination |
|------|--------|-------------|
| `v0-bundle.css` | `css/v0.css` import list | Bandzoogle → Design → Customize CSS |

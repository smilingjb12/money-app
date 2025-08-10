---
allowed-tools: Bash(*), Edit(*), MultiEdit(*), Read(*), Grep(*), TodoWrite(*), Glob(*)
description: Run npm run build and automatically fix any TypeScript or build errors
argument-hint: [optional: --lint to also run linting after build succeeds]
---

I'll run the build process and systematically fix any errors that come up.

## Build & Fix Process

Let me start by running the build to identify errors:

!npm run build

I'll analyze the build output and fix common error patterns:

### Common Error Patterns I'll Fix:
1. **Module not found errors**: Missing imports or incorrect paths
2. **TypeScript errors**: Type mismatches, missing types  
3. **Import/Export errors**: Incorrect import statements
4. **Missing dependencies**: Undefined variables or functions
5. **Path resolution issues**: Incorrect relative/absolute paths

### My Systematic Approach:
1. Parse build error messages to identify specific issues
2. Use Grep/Glob to find relevant files and understand the codebase structure
3. Read the problematic files to understand the context
4. Fix imports, types, and path issues using Edit/MultiEdit
5. Re-run build to verify fixes
6. Continue until build succeeds
7. Run linting if `--lint` argument is provided or if specified in CLAUDE.md

I'll work through each error methodically and provide clear explanations of what I'm fixing and why.

If you want me to also run linting after a successful build, use: `/build-fix --lint`
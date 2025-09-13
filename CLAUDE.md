# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript/Vite canvas-based animation project that renders a moving rectangle using the MainLoop.js game loop library. The project demonstrates a simple 2D canvas animation with a falling rectangle that resets to the top when it reaches the bottom of the canvas.

## Development Commands

- `pnpm run dev` or `task dev` - Start the Vite development server
- `pnpm run build` - Build the project (TypeScript compilation + Vite build)
- `pnpm run preview` - Preview the production build locally

## Architecture

The application follows a simple game loop pattern:

- **Entry Point**: `src/main.ts` - Sets up canvas, game objects, and starts the main loop
- **Game Loop**: Uses MainLoop.js library for consistent update/draw cycles
- **Canvas Rendering**: Direct 2D canvas context manipulation for drawing
- **Animation**: Time-based movement using delta time for frame-rate independent animation

### Key Components

- **Rectangle Object**: Simple interface with position, dimensions, and speed properties
- **Update Function**: Handles position updates and boundary checking (wrapping)
- **Draw Function**: Clears canvas and renders the rectangle
- **Main Loop**: Orchestrates update and draw calls at optimal frame rates

## Package Management

Uses pnpm as the package manager (configured in package.json). Always use `pnpm install` for dependencies.

## TypeScript Configuration

Strict TypeScript configuration with:
- ES2022 target
- Bundler module resolution
- Strict type checking enabled
- No unused variables/parameters allowed
- Canvas and DOM types included

## Resources
- MainLoop.js API docs: https://icecreamyou.github.io/MainLoop.js/docs/#!/api/MainLoop
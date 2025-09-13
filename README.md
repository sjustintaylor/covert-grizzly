# Captain's Log

A naval command and control prototype built with TypeScript, Vite, and HTML5 Canvas. This project demonstrates an orders-based interface system where players issue commands to a naval vessel through a realistic command structure with preparation times and physics-based movement.

## 🎮 How to Play

### Objective
Navigate your pink naval vessel to reach the moving green target. The faster you reach it, the higher your score!

### Controls
The game uses a realistic naval orders system where commands take time to prepare before execution:

#### Speed Controls
- **No Speed** - Stop the vessel
- **Half Speed** - Move at 50% maximum speed
- **Full Speed** - Move at maximum speed

#### Turn Controls
- **Turn Left** - Rotate the vessel 15 degrees to port (left)
- **Turn Right** - Rotate the vessel 15 degrees to starboard (right)

### Orders System
- Click any button to queue a command
- Commands have a **preparation phase** (shown by orange progress bar)
- After preparation, the order executes immediately
- Speed orders persist until a new speed order is given
- Turn orders execute for a fixed duration then stop

### Game Mechanics
- **Edge Wrapping**: Sail off any edge to appear on the opposite side
- **Target Movement**: The target oscillates left and right but doesn't wrap
- **Physics**: Realistic boat physics with momentum and rotation
- **Scoring**: Time-based scoring system rewards quick navigation

### Winning
- Reach the green target to win
- Your score decreases over time, so move quickly!
- Press **R** to restart after winning

## 🚀 Development Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd captains-log

# Install dependencies
pnpm install
```

### Available Scripts
```bash
# Start development server with hot reload
pnpm run dev
# or
task dev

# Build for production
pnpm run build
# or
task build

# Preview production build
pnpm run preview
```

### Development Workflow
- The game runs at `http://localhost:5173` during development
- Hot reload is enabled for instant feedback
- Use `task build` to verify TypeScript compilation

## 🏗️ Technical Architecture

### Core Technologies
- **TypeScript** - Strict type checking and modern ES features
- **Vite** - Fast build tool and development server
- **HTML5 Canvas** - 2D graphics rendering
- **MainLoop.js** - Game loop library for consistent frame timing

### Architecture Patterns
- **Game Loop Pattern** - Separate update and render phases
- **Command Pattern** - Orders system with queued commands
- **Entity-Component System** - Modular game object design
- **Canvas-Based Rendering** - Direct 2D context manipulation

### Key Components
- **GameState** - Main game coordinator and canvas management
- **Boat** - Player vessel with physics and rendering
- **Target** - Moving objective with collision detection
- **OrderSystem** - Command queuing and execution
- **UIController** - Button handling and progress display

### Features
- 🎯 **Realistic Naval Physics** - Momentum, rotation, and edge wrapping
- 📋 **Queued Command System** - Commands with preparation phases
- 📱 **Responsive Design** - Canvas adapts to container size
- ⏱️ **Time-Based Scoring** - Rewards quick and efficient navigation
- 🎨 **Clean UI** - Minimal interface focused on the command experience

## 🎯 Design Goals

This prototype explores:
- **Command Interface Design** - How users interact with complex systems
- **Realistic Timing** - Commands aren't instantaneous in real systems
- **Visual Feedback** - Progress bars and state indicators
- **Physics Integration** - How UI commands translate to realistic movement

Perfect for testing command-and-control interface concepts, naval simulation games, or any system requiring queued command execution with realistic timing constraints.
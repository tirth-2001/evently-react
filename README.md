<div align="center">

<h1> evently-react </h1>

<h3> A Hook-Based Framework for Event-Driven React Apps </h3>

![Banner](https://i.ibb.co/7KPsLmW/title-banner.png)

</div>

![npm](https://img.shields.io/npm/v/evently-react?style=flat-square)
![Downloads](https://img.shields.io/npm/dt/evently-react?style=flat-square)
![typescript](https://img.shields.io/badge/TypeScript-Supported-blue?style=flat-square)

## 📜 Table of Contents

1. [🎉 Overview](#-overview)
2. [⚡ Features](#-features)
3. [🚀 Getting Started](#-getting-started)
   - [Installation](#1️⃣-installation)
   - [Quickstart Example](#2️⃣-quickstart-example)
4. [🌟 Use Cases and Kickstarters](#-use-cases-and-kickstarters)
   - [Cross-Component Communication](#1️⃣-cross-component-communication)
   - [Global Notifications](#2️⃣-global-notifications)
   - [Dynamic Data Updates](#3️⃣-dynamic-data-updates)
   - [Hybrid State/Event Management](#4️⃣-hybrid-stateevent-management)
5. [🔧 Usage](#-usage)
   - [Emitting Events](#emitting-events)
   - [Subscribing to Events](#subscribing-to-events)
   - [Subscribing to Multiple Events](#subscribing-to-multiple-events)
   - [Using State from Events](#using-state-from-events)
6. [🕹️ Advanced Features](#-advanced-features)
   - [Middlewares](#middlewares-)
   - [In-Memory Caching](#in-memory-caching-)
   - [Priority-Based Subscription](#priority-based-subscription-)
   - [Accessing EventBus Instance](#accessing-eventbus-instance-)
7. [🔄 Comparison with Redux and Prop Drilling](#-comparison-with-redux-and-prop-drilling)
8. [💡 Tips](#-tips)
9. [📝 FAQs](#-faqs)
10. [🛠️ Support and Suggestion](#-support-and-suggestion)

---

## 🎉 Overview

`evently-react` simplifies event management for React developers. 🚀

Whether you're building a small app or a large-scale application, this package offers a clean and simplified design to manage robust and scalable event-driven architectures.

With its **hooks-based API**, `evently-react` enables seamless event handling while keeping your codebase clean and maintainable.

Say goodbye to prop drilling and global state chaos and hello to elegant, event-driven designs! 🎯

---

## ⚡ Features

- 💡 **Hooks-based API**: Simplifies event management with `useSubscribe`, `useEvent`, and `useSubscribeState`.
- 🧩 **In-memory Caching**: Supports late subscribers without missing events.
- 🔗 **Middleware Support**: Modify or intercept event payloads seamlessly.
- 📂 **Typed Events**: Built-in TypeScript support ensures type safety.
- ⚙️ **Non-React Compatibility**: Use exported `EventBus` class for other environments.

---

## 🚀 Getting Started

### 1️⃣ Installation

Install the package using npm or yarn:

```bash
npm install evently-react
# OR
yarn add evently-react
```

### 2️⃣ Quickstart Example

Below is a quick example to get started with `evently-react`.

```tsx
import React from 'react'
import { EventProvider, useEvent, useSubscribe } from 'evently-react'

// Define a publisher component
const Publisher: React.FC = () => {
  const { emitEvent } = useEvent()

  const handleClick = () => {
    emitEvent('greet', { message: 'Hello from Publisher!' }) // Emit an event
  }

  return <button onClick={handleClick}>Send Greeting</button>
}

// Define a subscriber component
const Subscriber: React.FC = () => {
  useSubscribe('greet', (eventName, payload) => {
    console.log(payload.message) // Log the event payload
  })

  return <p>Listening for greetings...</p>
}

// Wrap your application with EventProvider
const App: React.FC = () => (
  <EventProvider>
    <Publisher />
    <Subscriber />
  </EventProvider>
)

export default App
```

---

## 🌟 Use Cases and Kickstarters

`evently-react` is designed to simplify communication in complex React applications. Here are some inspiring real-world use cases to help you explore its potential:

### 1️⃣ **Cross-Component Communication**

Emit an event in one component and listen to it in another—no need for prop drilling or context juggling.

**Example:**

- A button in a header component emits an event to toggle a sidebar menu managed by a sibling component.

```tsx
// In Header component
emitEvent('toggleSidebar', { isVisible: true })

// In Sidebar component
useSubscribe('toggleSidebar', (eventName, payload) => setSidebarVisible(payload.isVisible))
```

### 2️⃣ **Global Notifications**

Create a centralized system for displaying notifications (like toast messages) triggered from anywhere in your app.

**Example:**

- A failed API call emits an event to show an error toast notification.

```tsx
emitEvent('showToast', { type: 'error', message: 'Failed to fetch data!' })
```

### 3️⃣ **Dynamic Data Updates**

Trigger UI updates in real-time when backend events or user actions occur.

**Example:**

- A WebSocket listener emits data updates that a dashboard component subscribes to for live charts or metrics.

```tsx
// WebSocket listener emits new data
emitEvent('updateMetrics', newMetrics)

// Dashboard listens to updates
useSubscribe('updateMetrics', (eventName, metrics) => updateChart(metrics))
```

### 4️⃣ **Hybrid State/Event Management**

Combine event-driven architecture with existing state management tools (e.g., Redux or Context API) for specific, modular use cases.

**Example:**

- Use events for decoupled interactions like resetting forms or syncing components without modifying the global state.

```tsx
// Emit form reset event
emitEvent('resetForm')

// Form component subscribes to reset action
useSubscribe('resetForm', (eventName, payload) => setFormData(initialValues))
```

By adopting `evently-react`, you can create scalable, decoupled, and maintainable solutions for modern web applications. 🎯

---

## 🔧 Usage

### Emitting Events

Use the `useEvent` hook to emit events:

```tsx
import React from 'react'
import { useEvent } from 'evently-react'

const EmitExample: React.FC = () => {
  const { emitEvent } = useEvent()

  const handleClick = () => {
    emitEvent('exampleEvent', { message: 'Hello, Evently!' }) // Emit an event with a payload
  }

  return <button onClick={handleClick}>Emit Event</button>
}

export default EmitExample
```

### Subscribing to Events

Use the `useSubscribe` hook to listen to events:

```tsx
import React from 'react'
import { useSubscribe } from 'evently-react'

const SubscribeExample: React.FC = () => {
  useSubscribe('exampleEvent', (eventName, payload) => {
    console.log('Received payload:', payload) // Logs: { message: 'Hello, Evently!' }
  })

  return <p>Listening for events...</p>
}

export default SubscribeExample
```

### Subscribing to Multiple Events

Use the enhanced `useSubscribe` hook to listen to multiple events:

```tsx
import React from 'react'
import { useSubscribe } from 'evently-react'

const MultiSubscribeExample: React.FC = () => {
  useSubscribe(['eventOne', 'eventTwo'], (eventName, payload) => {
    console.log(`Received payload for ${eventName}:`, payload)
  })

  return <p>Listening for multiple events...</p>
}

export default MultiSubscribeExample
```

### Using State from Events

Leverage the `useSubscribeState` hook to access the latest event payload as state:

```tsx
import React from 'react'
import { useSubscribeState } from 'evently-react'

const StateExample: React.FC = () => {
  const latestEventPayload = useSubscribeState('exampleEvent')

  return <p>Latest Payload: {latestEventPayload?.message}</p>
}

export default StateExample
```

---

## 🕹️ Advanced Features

### Middlewares 🔗

Middleware allows you to intercept or transform events before they are processed.

#### Global Middleware: `.use()`

```tsx
import { useEvent } from 'evently-react'

const App = () => {
  const { eventBus } = useEvent()

  eventBus.use((event, payload) => {
    console.log(`Global Middleware: ${event}`)
    return { ...payload, eventSeen: true }
  })

  return <div>Your App</div>
}
```

#### Event-Specific Middleware: `.useForEvent()`

```tsx
eventBus.useForEvent('myEvent', (event, payload) => {
  console.log(`Event middleware for ${event}`)
  return { ...payload, transformed: true }
})
```

---

### In-Memory Caching 📦

Late subscribers can still receive the latest events:

```tsx
useSubscribe('exampleEvent', (eventName, payload) => {
  console.log('Late subscriber received:', payload) // Works even if the event was emitted earlier
})
```

---

### Priority-Based Subscription 🚦

Control the execution order of event handlers by assigning priorities. Higher priority callbacks execute first (default is `0`).

```tsx
// Low priority handler.
useSubscribe('important-event', (eventName, payload) => console.log('Low priority'), 1)

// High priority handler.
useSubscribe('important-event', (eventName, payload) => console.log('High priority'), 3)
```

Handlers are executed in descending order of priority, making it easy to manage complex event flows.

---

### Accessing EventBus Instance 🚌

The `eventBus` instance, accessible via the `useEvent` hook, allows integration of `evently-react` into non-Component environments such as utility functions or external libraries. This enables advanced use cases like chaining events, transforming payloads, or other customized workflows.

#### Example: Using EventBus in Utility Functions

The following example demonstrates how to pass the `eventBus` instance to a utility function for chaining events:

```tsx
// Component file
import { useEvent } from 'evently-react'
import { handleEventChain } from './utils'

const Component = () => {
  const { eventBus } = useEvent()

  // Pass the eventBus instance to utility functions
  handleEventChain('logoutUser', eventBus)

  return <div>Event Handling Component</div>
}

// utils.ts
import { EventBus } from 'evently-react'

export function handleEventChain(eventName: string, eventBus: EventBus) {
  eventBus.subscribe(eventName, payload => {
    if (payload.action === 'logout') {
      console.log('Logging out user...')

      // Emitting new event based on received payload
      eventBus.emit('resetPreferences', { message: 'Resetting preferences...' })
    }
  })
}
```

#### Use Cases:

- **Chaining Events:** Trigger subsequent events based on specific payload conditions.
- **Transforming Payloads:** Modify or enrich event data before emission using middlewares.
- **Non-Component Interactions:** Handle events in service layers, utility files, or middleware systems.

**Tip:** If the use case is completely non-React, consider using the `EventBus` class directly. Instead of using hooks, you can create an instance of `EventBus` and leverage its methods for event management.

This feature extends the power of evently-react beyond React components, enabling seamless integration in diverse workflows. 🚀

---

## 🔄 Comparison with Redux and Prop Drilling

| Feature                                 | Redux Equivalent | evently-react Alternative          |
| --------------------------------------- | ---------------- | ---------------------------------- |
| Dispatch actions                        | `dispatch`       | `emitEvent`                        |
| Select state                            | `useSelector`    | `useSubscribeState`                |
| Middleware/Event Processing             | `thunks/sagas`   | Global & Event-specific Middleware |
| Centralized store & reducer boilerplate | Required         | Not Required                       |
| Prop drilling                           | Problematic      | Eliminated                         |

Inject `evently-react` seamlessly into existing projects and reduce boilerplate while maintaining scalability.

**Note:** `evently-react` is not intended to replace Redux/Context API or prop drilling entirely. Instead, it provides a complementary event-driven approach to simplify code and improve scalability. By leveraging this pattern, you can reduce boilerplate and decouple components without sacrificing existing architecture.

---

## 💡 Tips

- 🎯 Use meaningful event names to keep your event flow intuitive.
- 💾 Middleware can be a powerful way to enforce validation or transformations across events.
- ⚙️ Use in-memory caching to ensure real-time updates for dynamic UIs.
- 🧩 Combine `evently-react` with React context or Redux for hybrid state/event management solutions.
- 📦 Explore lazy-loaded modules to reduce initial app load while still utilizing events.

---

## 📝 FAQs

### 1️⃣ What is a real-world use case for `evently-react`?

- **Cross-Component Communication**: Emit an event in one component and listen in another without prop drilling.
- **Global Notifications**: Show toast notifications across your app.
- **Dynamic Data Updates**: Trigger real-time UI updates based on backend events.

### 2️⃣ How do I define types for events in my project?

- Create an `evently.d.ts` file in your project and extend the `Events` type:

```tsx
import 'evently-react'

declare module 'evently-react' {
  export interface Events {
    showToast: { message: string; duration: number }
    setTheme: { theme: 'light' | 'dark' }
  }
}
```

### 3️⃣ Can I use `evently-react` in non-React environments?

- **Yes!** You can use the exported `EventBus` class instance to integrate event-based communication in non-React environments. (Example: Vanilla JS, Angular and other frameworks) All methods like `emit`, `subscribe`, and middleware support are fully available.

### 4️⃣ How to subscribe multiple events in one component?

- Simply call `useSubscribe` and give array of event names as parameter. It will listen to all the events provided in the array.

### 5️⃣ Is there a plan to support other frameworks?

- Yes, there are plans to release individual packages for other frameworks in the future.

---

## 🛠️ Support and Suggestion

Having issues or have a suggestion?

- 🐞 [Report a Bug](https://github.com/tirth-2001/evently-react/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5BBug%5D+)
- 💡 [Request a Feature](https://github.com/tirth-2001/evently-react/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%5BFeature%5D+)
- 📚 [Join the Discussion](https://github.com/tirth-2001/evently-react/discussions)

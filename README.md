# ETH Quest App

This is a Next.js project built with Reown AppKit and Wagmi for Ethereum interactions.

## Features

- **Next.js 16**: Utilizing the latest features of the React framework.
- **Reown AppKit**: Seamless wallet connection and interaction.
- **Wagmi**: React Hooks for Ethereum.
- **TanStack Query**: Powerful asynchronous state management.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Getting Started

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Run Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

3.  **Build for Production:**

    ```bash
    npm run build
    ```

## Configuration

The project uses `app/providers.tsx` to configure the Web3 Connectors. Ensure you set your `projectId` in `app/providers.tsx` or via environment variables for Reown AppKit to function correctly.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Utility functions.
- `smartcontract/`: Solidity smart contracts (foundry).

## Troubleshooting

If you encounter build errors related to `thread-stream` or `worker_threads` tracing with Turbopack, try running dev mode or checking `next.config.ts` for exclusion rules.

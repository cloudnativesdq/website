# Cloud Native Santo Domingo Website

This is the official website for the **Cloud Native Santo Domingo** community, a CNCF-affiliated group dedicated to promoting cloud-native technologies in the Dominican Republic.

## 🚀 Built With

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Vercel Analytics](https://vercel.com/analytics)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 24 (see `.nvmrc`)
- [pnpm](https://pnpm.io/) 11, through Corepack: `corepack enable`

### Installation

1. Clone the repository with its submodule:
   ```bash
   git clone --recurse-submodules https://github.com/cloudnativesdq/website.git
   cd website
   ```

2. Set up the environment (checks versions, installs dependencies, creates `.env.local`):
   ```bash
   pnpm run dev:setup
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

See [CONTRIBUTING.md](CONTRIBUTING.md) for worktrees, planning changes with OpenSpec and the checks to run before a pull request.

<!-- throwaway docs-only edit to test the OpenSpec gate -->

## 📦 Deployment

The project is configured for deployment on [Vercel](https://vercel.com/).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

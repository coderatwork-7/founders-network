# Founders Network - [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`]

## Getting Started

Install latest verion of node (recommended > 18.0)

First, install dependecies and run the development server:

```bash
1. npm install

2. npm run dev
   # or
   yarn dev
```

Open [localhost:3000](http://localhost:3000) with your browser to see the result.

To run the development server in Production Mode:

```bash
1. npm run build
   # or
   yarn build
2. npm start
```

## VS Code Editor

We recommend to use VS Code as a code editor.
Install VS Code plugins ESLint and Prettier - Code formatter for linting and code formatting respectively.

## Auto-formatting on save:

Inside `/.vscode/settings.json` we set prettier as the default formatter, and also set `editor.codeActionsOnSave` to run:

- **Lint:** `"source.fixAll.eslint"`
- **Format:** `"source.fixAll.format"`

## Checking standards pre-commit:

Using [husky](https://www.npmjs.com/package/husky) we can check all of our style standards to make sure our git commits are up to par. Check those checks out at [`.husky/pre-commit`](.husky/pre-commit)

## Added pre-commit check for Commit message

Message format: <Ticket-number>: "Commit Message"
Example: FOUN-14: Added login and forgot password changes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## File structures

# Components

- Cards

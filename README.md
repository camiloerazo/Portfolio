# Code Showcase

## Description

This project is a personal portfolio website designed to showcase my software development projects hosted on GitHub. It demonstrates my ability to build modern, responsive, full-stack web applications using a variety of technologies and techniques.

## Features

-   **Dynamic Project Listing:** Fetches public repositories directly from the GitHub API.
-   **Enhanced Project Details:** Retrieves README content and main code files for deeper project insights.
-   **Automated Summaries:** Generates project summaries based on repository metadata, README analysis, and code file characteristics.
-   **AI-Powered Images:** Fetches relevant images for projects using the Unsplash API based on project name, description, and technologies.
-   **Featured Projects:** Allows highlighting specific projects on the main page via an administrative interface.
-   **Project Filtering:** Users can filter projects by technology tags.
-   **Responsive Design:** Built with Tailwind CSS for a seamless experience across devices.
-   **Admin Panel:** A password-protected route (`/projects`) to manage which projects are featured.
-   **Persistence:** Featured project status is persisted using LocalStorage.
-   **Contact Section:** Provides links to social media profiles and contact information.

## Technologies Used

**Frontend:**

*   [Next.js](https://nextjs.org/) (React Framework)
*   [React](https://react.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Tailwind CSS](https://tailwindcss.com/) (Styling)
*   [Shadcn UI](https://ui.shadcn.com/) (Component Library)

**Backend:**

*   [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
*   [Node.js](https://nodejs.org/) (Runtime Environment)

**APIs:**

*   [GitHub REST API](https://docs.github.com/en/rest)
*   [Unsplash API](https://unsplash.com/developers)

**Other:**

*   Environment Variables (`.env.local`)
*   [Zod](https://zod.dev/) (Schema Validation - used in AI summary flow)

## Techniques & Concepts

*   **Full-Stack Architecture:** Utilizing Next.js for both frontend rendering and backend API routes.
*   **Server-Side Data Fetching:** Fetching GitHub and Unsplash data on the server within API routes.
*   **Client-Side Interactivity:** Using React hooks (`useState`, `useEffect`, `useMemo`) for managing UI state and side effects.
*   **API Integration:** Securely interacting with external APIs (GitHub, Unsplash) using environment variables.
*   **Asynchronous Programming:** Using `async/await` and `Promise.allSettled` for efficient data fetching.
*   **Environment Variable Management:** Securely storing sensitive API keys outside of the codebase.
*   **Component-Based Development:** Structuring the UI into reusable React components.
*   **Routing:** Implementing client-side navigation and a protected admin route with Next.js Router.
*   **Local Storage:** Persisting featured project status client-side for a consistent user experience.
*   **Basic Authentication:** Simple password protection for the admin management page.
*   **Error Handling:** Implementing error handling for API calls and data processing.
*   **Responsive Design:** Building a layout that adapts to different screen sizes using Tailwind CSS utility classes.

## Setup and Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
GITHUB_TOKEN=your_github_token_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

*   **GITHUB_TOKEN:** Generate a GitHub Personal Access Token with `public_repo` scope. [Learn how to create a token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
*   **UNSPLASH_ACCESS_KEY:** Obtain an API access key from the Unsplash Developer website. [Get an Unsplash API key](https://unsplash.com/developers).

**Note:** Do not commit your `.env.local` file to version control. Ensure it's included in your `.gitignore`.

## Running the Project

```bash
npm run dev
```

This will start the development server at `http://localhost:9002`.

## Admin Panel

Access the project administration panel at `/projects`. The default password is `portfolio2024`. **Change this default password in `src/app/projects/page.tsx` for production.**

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

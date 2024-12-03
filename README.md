# Misinformation Detection System

A Real-Time Misinformation Detection and Verification System for Broadcast Media built with Next.js, React, and TypeScript.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed Node.js (v14.0.0 or later)
* You have installed npm (v6.0.0 or later)
* You have a basic understanding of React and Next.js

## Installation

To install the Misinformation Detection System, follow these steps:

1. Clone the repository:

```git clone [https://github.com//TruthTell.git]```


2. Navigate to the project directory:

```cd misinformation-detection-system```

3. Install the dependencies:

```npm install```

## Configuration

1. Create a `.env.local` file in the root directory of the project.

2. Add the following environment variables to the `.env.local` file:

```NEXTAUTH_URL=[http://localhost:3000](http://localhost:3000)```
```NEXTAUTH_SECRET=your_nextauth_secret```
```GITHUB_ID=your_github_oauth_id```
```GITHUB_SECRET=your_github_oauth_secret```

Replace `your_nextauth_secret`, `your_github_oauth_id`, and `your_github_oauth_secret` with your actual values.

3. If you're using other authentication providers or additional services, add their respective environment variables here as well.

## Running the Project

To run the Misinformation Detection System, follow these steps:

1. Start the development server:

```npm run dev```

2. Open your web browser and navigate to `http://localhost:3000`.

## Additional Notes

- This project uses shadcn/ui components. If you need to add more components, you can do so using the following command:

```npx shadcn@latest add [component-name]```

- The smart contract integration for voting is currently a placeholder. You'll need to implement the actual smart contract and update the `voting.tsx` component accordingly.

- The live broadcast analysis using WebRTC and ffmpeg is also a placeholder. You'll need to implement the actual integration in the `live-broadcast-analysis.tsx` component.

- Make sure to update the `AuthProvider` in `components/auth-provider.tsx` with your chosen authentication method.

## Contributing

If you want to contribute to this project, please fork the repository and create a pull request, or open an issue for discussion.

## License

This project uses the following license: [MIT License](https://opensource.org/licenses/MIT).
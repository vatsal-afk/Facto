import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        // Hardcoded users
        const hardcodedUsers = [
          {
            email: "admin@example.com",
            password: "admin123", // Hardcoded password
            role: "admin",
          },
          {
            email: "user@example.com",
            password: "user123",
            role: "user",
          },
        ];

        // Find user by email
        const user = hardcodedUsers.find((u) => u.email === email);

        if (!user || user.password !== password) {
          console.log("Invalid credentials");
          return null;
        }

        return { email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // ✅ Store role in JWT token
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = { ...session.user, role: token.role, email: token.email }; // ✅ Ensure session.user contains role
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

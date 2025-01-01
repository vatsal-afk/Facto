import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pages } from "next/dist/build/templates/app-page";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:{label: "Email", type: "text"},
        password:{label: "Password", type: "password"},
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // console.log("connecting to db ");
          await connectMongoDB();

          // console.log("Finding user with email:", email);
          const user = await User.findOne({ email });

          if (!user) {
            console.log("No user found with this email.");
            return null;
          }
          // console.log("User found:", user);

          // console.log("Comparing passwords...");
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            // console.log("Provided password:", password);
            // console.log("Stored hashed password:", user.password);
            console.log("Passwords do not match.");
            return null;
          }
          
          // console.log("Passwords match. Returning user.");
          return user;
        } catch (error) {
          console.error("Error in authorize function:", error);
          throw new Error("Authorization failed.");
        }
      },
    }),
  ],
  callbacks:{
    async jwt({token,user}){
      if(user){
        token.role=user.role;

      }
      return token;
    },
    async session ({session, token}){
      if(token){
        session.user.role=token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { signIn } from "next-auth/react";
// import { pages } from "next/dist/build/templates/app-page";

// const authOptions = {

//     providers:[
//         CredentialsProvider({
//             name: "credentials",
//             credentials: {},

//             async authorize(credentials){
//                 const user = {id:"1"};
//                 return user;
//             },


//         })
//     ],
//     session:{
//         strategy: "jwt",
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     pages:{
//         signIn: "/signin",
//     }
// };

// const handler = NextAuth(authOptions);

// export {handler as GET, handler as POST};
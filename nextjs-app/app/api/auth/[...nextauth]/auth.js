import axiosInstance from "@/axios"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
const handler = NextAuth({

    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          try {
            const res = await axiosInstance.post("auth/sign-in", {
              username: credentials.username,
              password: credentials.password
            })
            const { data, user, message } = res.data

            if (data && user) {
              return {
                id: user.id,
                user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
              }
            }
            return null
          } catch (error) {
            return null
          }
        }
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id
          token.username = user.username
          token.accessToken = data.accessToken
          token.refreshToken = data.refreshToken
        }
        return token
      },
      async session({ session, token }) {
        session.id = token.id
        session.username = token.username
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
        return session
      }
    },
})

export { handler as GET, handler as POST }
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // Allowed email or email domain string
            const allowedEmail = process.env.ALLOWED_EMAIL;

            // Check if the user's email matches the allowed email
            if (user?.email === allowedEmail || !allowedEmail) {
                return true;
            }

            // If not, reject the sign-in
            return "/api/auth/error?error=AccessDenied";
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth;
        },
    },
});

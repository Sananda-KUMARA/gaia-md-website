import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import UserModel from '../../../../models/User';

// Configuration NextAuth
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
       
        await dbConnect();
        // Rechercher l'utilisateur dans la base de données
        const user = await UserModel.findOne({ email: credentials.email });
       
        if (!user) {
          throw new Error('Aucun utilisateur trouvé avec cet email');
        }
        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error('Mot de passe incorrect');
        }
        // Retourner les informations de l'utilisateur
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Ajouter les propriétés personnalisées au token JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajouter les propriétés personnalisées à la session
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // S'assurer que toutes les redirections restent sur votre domaine
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/logout',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Créer un gestionnaire NextAuth avec App Router
const handler = NextAuth(authOptions);

// Exporter les méthodes HTTP nécessaires
export { handler as GET, handler as POST };
// pages/api/auth/[...nextauth].ts
import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import UserModel, { IUser } from '../../../models/User';

// Étendre l'interface User de next-auth
interface ExtendedUser extends User {
  id: string;
  role: string;
}

// Options pour NextAuth
export const authOptions: NextAuthOptions = {
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
        token.id = (user as ExtendedUser).id;
        token.role = (user as ExtendedUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajouter les propriétés personnalisées à la session
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;

// Étendre les types pour Next-Auth
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
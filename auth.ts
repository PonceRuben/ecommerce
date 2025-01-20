import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    // jwt() se ejecuta cada vez que se crea o actualiza un token JWT
    async jwt({ token, user }) {
      if (user) {
        // Asignar un valor de rol al token si el usuario acaba de iniciar sesión
        token.role = user.role; // Esto solo debería funcionar si ya se pasó el rol con el usuario
      }
      return token;
    },

    // session() se utiliza para agregar la información del token a la sesión del usuario
    async session({ session, token }) {
      session.user.role = token.role; // Se pasa el rol al session.user
      if (!session.user.role) {
        // Si el rol no está en el token, lo obtendremos de la base de datos
        const userId = Number(session.user.id); // Asegúrate de que el userId está en el token

        if (!isNaN(userId)) {
          const userRole = await prisma.user_Role.findFirst({
            where: {
              userId: userId,
            },
            select: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          });

          // Asignar el rol obtenido de la base de datos
          if (userRole) {
            session.user.role = userRole.role.name;
          }
        }
      }
      return session;
    },
  },
});

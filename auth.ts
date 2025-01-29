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
      if (user && user.id) {
        // Cuando `user` está presente (flujo de inicio de sesión), asigna el ID
        token.id = typeof user.id === "number" ? user.id : 0;
        const userId = Number(user.id);

        if (!isNaN(userId)) {
          // Buscar el rol del usuario desde la tabla intermedia
          const userRole = await prisma.user_Role.findFirst({
            where: { userId: userId },
            select: {
              role: {
                select: {
                  name: true, // Obtén el nombre del rol
                },
              },
            },
          });
          // Asignar el rol al token
          if (userRole) {
            token.role = userRole.role.name;
          }
        }
      } else if (token.sub) {
        // Cuando `user` no está disponible (flujo normal), usa el `sub` como ID
        token.id = Number(token.sub);
      }
      return token;
    },

    // session() se utiliza para agregar la información del token a la sesión del usuario
    async session({ session, token }) {
      if (token.id) {
        // Agrega el ID del token a la sesión del usuario
        (session.user as { id: number }).id = token.id;
      }

      // Intenta asignar el rol desde el token
      session.user.role = token.role;

      if (!session.user.role) {
        // Si el rol no está en el token, busca en la base de datos
        const userId = Number(session.user.id);

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

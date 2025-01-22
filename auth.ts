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
        const userId = Number(user.id);
        if (!isNaN(userId)) {
          // Buscar el primer rol del usuario en la relación intermedia (User_Role)
          const userRole = await prisma.user_Role.findFirst({
            where: { userId: userId }, // Ahora estamos usando un número para la consulta
            select: {
              role: {
                select: {
                  name: true, // Obtén el nombre del rol
                },
              },
            },
          });
          // Asignar el nombre del rol al token
          if (userRole) {
            token.role = userRole.role.name;
          }
        }
      }
      return token;
    },

    // session() se utiliza para agregar la información del token a la sesión del usuario
    async session({ session, token }) {
      // Aquí se obtiene el rol del usuario desde la tabla intermedia
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

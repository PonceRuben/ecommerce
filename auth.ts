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
    //jwt() se ejecuta cada vez que se crea o actualiza un toke JWT
    //Aca es donde se puede agregar información adicional al token
    async jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        //Obtener el rol asociado al usuario desde la tabla user_role

        const userId = Number(user.id);
        if (isNaN(userId)) {
          throw new Error("User ID is not a valid number");
        }

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

        // Agregar el rol al token
        if (userRole) {
          token.role = userRole.role.name;
        }
      }
      return token;
    },
    // session() se utiliza para agregar la información del token a la sesión del usuario, lo que hace que esté disponible en el cliente
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});

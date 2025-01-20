import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid credentials");
        }

        //verificar si exist el usuario en la base de datos
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });
        if (!user || !user.password) {
          throw new Error("User wasn't found");
        }

        // verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect Password");
        }

        return {
          id: String(user.id), // Convertimos el ID a string
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          username: user.username,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;

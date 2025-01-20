"use client";

import { z } from "zod";
import { loginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/actions/auth-actions";
import { useState } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const FormLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await loginAction(values);
      console.log(response);
      if (response.error) {
        setError(response.error); //estos errores no son de cliente, si no del backend y están en el authconfig.ts
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <div className="flex justify-center p-4 min-h-[50vh] bg-[#01141f] px-3">
      <div className="w-full max-w-lg bg-[#02242d] p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[#bfbfbf] mb-8">
          Login
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-[#bfbfbf] font-semibold mb-2">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="w-full px-4 py-2 border border-[#03424a] rounded-lg text-white bg-[#01141f] focus:outline-none focus:ring-2 focus:ring-[#02333c] placeholder:text-[#bfbfbf]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-[#bfbfbf] font-semibold mb-2">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                      className="w-full px-4 py-2 border border-[#03424a] rounded-lg text-white bg-[#01141f] focus:outline-none focus:ring-2 focus:ring-[#02333c] placeholder:text-[#bfbfbf]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormMessage>{error}</FormMessage>}
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#03424a] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#02333c] transition duration-200"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default FormLogin;

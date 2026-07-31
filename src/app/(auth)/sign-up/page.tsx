"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { signUpSchema } from "@/schemas/signUpSchema"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


const Page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [debouncedUsername] = useDebounceValue(username, 300)

  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })


  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) {
        return
      }

      setIsCheckingUsername(true)
      setUsernameMessage("")

      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`
        )

        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>

        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUsernameUnique()
  }, [debouncedUsername])


  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post("/api/sign-up", data)

      toast.add({
        title: "Success",
        description: response.data.message,
      })

      router.replace(`/verify/${data.username}`)
    } catch (error) {
      console.error("Error signing up the user:", error)

      const axiosError = error as AxiosError<ApiResponse>

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong"

      toast.add({
        title: "Sign-up error",
        description: errorMessage,
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">

        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Join Anonymous Feedback
          </h1>

          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>


        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >

            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Username</FormLabel>

                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setUsername(e.target.value)
                    }}
                  />

                  {isCheckingUsername && (
                    <Loader2 className="animate-spin" />
                  )}

                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}

                  <FormMessage />

                </FormItem>
              )}
            />


            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Email</FormLabel>

                  <Input {...field} />

                  <p className="text-sm text-gray-400">
                    We will send you a verification code
                  </p>

                  <FormMessage />

                </FormItem>
              )}
            />


            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>

                  <FormLabel>Password</FormLabel>

                  <Input
                    type="password"
                    {...field}
                  />

                  <FormMessage />

                </FormItem>
              )}
            />


            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

          </form>
        </Form>


        <div className="mt-4 text-center">
          <p>
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Page


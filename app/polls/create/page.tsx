"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormError from "@/components/ui/form-error";
import Navbar from "@/components/Navbar";
import {
  AlertCircle,
  Plus,
  X,
  Loader2,
  ScrollIcon as PollIcon,
} from "lucide-react";
import { createPoll } from "@/lib/polls";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { motion } from "framer-motion";

const createPollSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .max(500, { message: "Description must be at most 500 characters long" })
    .optional(),
  options: z
    .array(
      z.object({
        text: z
          .string()
          .min(1, { message: "Option text is required" })
          .max(100, {
            message: "Option text must be at most 100 characters long",
          }),
      })
    )
    .min(2, { message: "At least 2 options are required" })
    .max(10, { message: "Maximum 10 options allowed" }),
});

type CreatePollFormValues = z.infer<typeof createPollSchema>;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function CreatePollPage() {
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<CreatePollFormValues>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control,
  });

  const onSubmit = async (data: CreatePollFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to create a poll",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const options = data.options.map((option) => option.text);
      const poll = await createPoll(
        data.title,
        data.description || null,
        options,
        user.id
      );

      toast({
        title: "Poll created successfully",
        description: "Your poll is now available for voting",
      });

      router.push(`/polls/${poll.id}`);
    } catch (error: any) {
      console.error("Error creating poll:", error);
      setError("root", {
        message: error.message || "Failed to create poll. Please try again.",
      });

      toast({
        title: "Error creating poll",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    if (fields.length < 10) {
      append({ text: "" });
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4"
            {...fadeIn}
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading...</p>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            className="max-w-md w-full bg-card border rounded-lg p-8 shadow-lg"
            {...fadeIn}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg"></div>
                <PollIcon className="h-12 w-12 text-primary relative" />
              </div>
              <h1 className="text-2xl font-bold">Sign in to create a poll</h1>
              <p className="text-muted-foreground">
                You need to be signed in to create and manage polls.
              </p>
              <div className="flex gap-4 mt-2">
                <Button asChild size="lg" className="min-w-[120px]">
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-w-[120px]"
                >
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 px-6 md:px-8 lg:px-5 py-6 md:py-10 px-4">
        <motion.div
          className="max-w-2xl mx-auto bg-card border rounded-lg p-6 md:p-8 shadow-lg"
          {...fadeIn}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg"></div>
              <PollIcon className="h-8 w-8 text-primary relative" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Create a Poll
              </h1>
              <p className="text-muted-foreground">
                Create a new poll and start collecting responses
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root?.message && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium leading-none"
              >
                Poll Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                {...register("title")}
                placeholder="What would you like to ask?"
                className={`${
                  errors.title ? "border-destructive" : ""
                } bg-background/50 backdrop-blur-sm`}
              />
              <FormError error={errors.title?.message} />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none"
              >
                Description{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Add more context about your poll"
                className={`${
                  errors.description ? "border-destructive" : ""
                } bg-background/50 backdrop-blur-sm min-h-[100px]`}
              />
              <FormError error={errors.description?.message} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none">
                  Poll Options <span className="text-destructive">*</span>
                </label>
                <p className="text-xs text-muted-foreground">
                  {fields.length}/10 options
                </p>
              </div>

              {errors.options?.message && (
                <FormError error={errors.options.message} />
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-grow space-y-1">
                      <div className="relative">
                        <Input
                          {...register(`options.${index}.text`)}
                          placeholder={`Option ${index + 1}`}
                          className={`${
                            errors.options?.[index]?.text
                              ? "border-destructive"
                              : ""
                          } bg-background/50 backdrop-blur-sm pr-10`}
                        />
                        {fields.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormError
                        error={errors.options?.[index]?.text?.message}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {fields.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="w-full bg-background/50 backdrop-blur-sm hover:bg-accent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              )}
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none sm:min-w-[200px]"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Poll...
                  </>
                ) : (
                  "Create Poll"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 sm:flex-none sm:min-w-[200px]"
                disabled={isSubmitting}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

"use server";
import { z } from "zod";
import { auth } from "@/auth";
import { Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/db";
import paths from "@/paths";
import { revalidatePath } from "next/cache";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
      message: "Must be lowercase letters or dashes without spaces",
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[]; //array of strings,
    description?: string[];
    generalFormIssues?: string[];
  };
}

//we need to make sure the function returns a value with that type of formState
//to do that we can put in a declared type return annotation on the function
//The Promise is because this is an async function
export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  //TO DO: Revalidate the Home Page after creating a topic

  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();

  if (!session || !session.user) {
    return {
      errors: {
        generalFormIssues: ["You must be signed in to create a topic!"],
      },
    };
  }

  //This a common pattern in a Next project : let - try/catch - redirect
  //we initialize a topic variable with the Topic interface so we can later pass it off to redirect
  let topic: Topic;

  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name, //the name is a slug
        description: result.data.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          generalFormIssues: [err.message],
        },
      };
    } else {
      return {
        errors: {
          generalFormIssues: ["Something went wrong"],
        },
      };
    }
  }

  revalidatePath("/");
  redirect(paths.topicShowPath(topic.slug));
}

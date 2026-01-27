"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  aiPoweredContentCreation,
  type AIPoweredContentCreationInput,
} from "@/ai/flows/ai-powered-content-creation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const formSchema = z.object({
  postDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageType: z.enum(["filter", "background"]),
  imageToEdit: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AiCreationForm() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postDescription: "",
      imageType: "background",
    },
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          resolve(event.target.result);
        } else {
          reject(new Error("Failed to read file."));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      let imageToEditDataUri: string | undefined = undefined;
      if (data.imageToEdit && data.imageToEdit[0]) {
        imageToEditDataUri = await fileToDataUri(data.imageToEdit[0]);
      }

      const input: AIPoweredContentCreationInput = {
        postDescription: data.postDescription,
        imageType: data.imageType as "filter" | "background",
        imageToEditDataUri,
      };

      const result = await aiPoweredContentCreation(input);
      setGeneratedImage(result.generatedImageDataUri);
    } catch (error) {
      console.error("AI content creation failed:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with the AI generation. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="postDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">Post Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A vibrant and energetic post about a summer music festival"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the vibe and content of your post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg font-headline">Content Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="background" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Generate a Background
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="filter" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Suggest a Filter/Edit
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageToEdit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">Upload Image (Optional)</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" {...form.register("imageToEdit")} />
                    </FormControl>
                    <FormDescription>
                      Upload an image if you want the AI to edit it or apply a filter.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} size="lg" className="w-full font-headline">
                {isLoading ? "Generating..." : "Generate with AI"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-center h-full min-h-[300px] lg:min-h-0">
          <div className="w-full aspect-square relative">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Skeleton className="w-full h-full rounded-lg" />
                 <p className="mt-4 text-muted-foreground animate-pulse">AI is creating magic...</p>
              </div>
            )}
            {!isLoading && generatedImage && (
              <Image
                src={generatedImage}
                alt="AI generated content"
                fill
                className="rounded-lg object-contain"
                data-ai-hint="abstract art"
              />
            )}
            {!isLoading && !generatedImage && (
              <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                 <Sparkles className="w-16 h-16 mb-4"/>
                <p>Your generated image will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

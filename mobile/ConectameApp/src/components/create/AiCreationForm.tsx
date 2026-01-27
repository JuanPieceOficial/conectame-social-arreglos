import * as React from "react";
import { useState } from "react";
import { View, Text, Image } from "react-native";
import { styled } from "nativewind";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { aiPoweredContentCreation, type AIPoweredContentCreationInput } from "@/ai/flows/ai-powered-content-creation";


const formSchema = z.object({
  postDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageType: z.enum(["filter", "background"]),
  imageToEdit: z.string().nullable().optional(), // Now expects base64 string or null
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
      imageToEdit: null, // Default to null for imageToEdit
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const input: AIPoweredContentCreationInput = {
        postDescription: data.postDescription,
        imageType: data.imageType as "filter" | "background",
        imageToEditDataUri: data.imageToEdit || undefined, // Use the base64 string directly
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
    <StyledView className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <StyledView className="space-y-8"> {/* Replaced form tag with StyledView */}
              <FormField
                control={form.control}
                name="postDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">Post Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A vibrant and energetic post about a summer music festival"
                        // rows={5} // `rows` prop is not applicable to React Native Textarea (TextInput multiline)
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
                        value={field.value} // Use value instead of defaultValue
                        className="flex flex-col space-y-1"
                      >
                        <StyledView className="flex flex-row items-center space-x-3">
                          <FormControl>
                            <RadioGroupItem value="background" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Generate a Background
                          </FormLabel>
                        </StyledView>
                        <StyledView className="flex flex-row items-center space-x-3">
                          <FormControl>
                            <RadioGroupItem value="filter" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Suggest a Filter/Edit
                          </FormLabel>
                        </StyledView>
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
                      <ImageInput
                        onImageSelected={(dataUri) => field.onChange(dataUri)}
                        currentImageUri={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image if you want the AI to edit it or apply a filter.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button onPress={form.handleSubmit(onSubmit)} disabled={isLoading} textClassName="font-headline">
                <StyledView className="flex-row items-center">
                  <MaterialCommunityIcons name="sparkles" size={20} color="white" />
                  <StyledText className="ml-2 text-white font-semibold">{isLoading ? "Generating..." : "Generate with AI"}</StyledText>
                </StyledView>
              </Button>
            </StyledView>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-center h-full min-h-[300px]">
          <StyledView className="w-full aspect-square relative">
            {isLoading && (
              <StyledView className="flex flex-col items-center justify-center h-full">
                <Skeleton className="w-full h-full rounded-lg" />
                 <StyledText className="mt-4 text-muted-foreground animate-pulse">AI is creating magic...</StyledText>
              </StyledView>
            )}
            {!isLoading && generatedImage && (
              <StyledImage
                source={{ uri: generatedImage }}
                alt="AI generated content"
                className="rounded-lg w-full h-full object-contain"
                resizeMode="contain"
              />
            )}
            {!isLoading && !generatedImage && (
              <StyledView className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                 <MaterialCommunityIcons name="sparkles" size={64} color="hsl(var(--muted-foreground))" />
                <StyledText className="mt-4">Your generated image will appear here.</StyledText>
              </StyledView>
            )}
          </StyledView>
        </CardContent>
      </Card>
    </StyledView>
  );
}

import { AiCreationForm } from "@/components/create/ai-creation-form";

export default function CreatePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold font-headline">AI-Powered Creation</h1>
          <p className="text-muted-foreground">
            Need inspiration? Describe your post and let our AI suggest a filter or design a background for you.
          </p>
        </div>
        <AiCreationForm />
      </div>
    </div>
  );
}

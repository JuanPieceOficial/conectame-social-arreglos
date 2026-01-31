import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image"; // Will keep this for future image display
// import { PlaceHolderImages } from "@/lib/placeholder-images"; // REMOVE THIS

export default function ExplorePage() {
  // const exploreImages = PlaceHolderImages.filter(img => img.id.startsWith('explore')); // REMOVE THIS

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Explore</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/*
          Currently, there are no actual images to display.
          This section would ideally fetch trending posts or images from Supabase.
          For now, showing a placeholder message.
        */}
        <p className="text-center text-muted-foreground col-span-full">
          No content to explore yet. Check back later!
        </p>
        {/*
        {exploreImages.map((image) => (
          <Card key={image.id} className="overflow-hidden group">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  data-ai-hint={image.imageHint}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        */}
      </div>
    </div>
  );
}
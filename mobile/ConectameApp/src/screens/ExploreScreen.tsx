import * as React from "react";
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { styled } from "nativewind";

import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

const { width: screenWidth } = Dimensions.get('window'); // Rename width to screenWidth to avoid conflict

export function ExploreScreen() {
  const exploreImages = PlaceHolderImages.filter(img => img.id.startsWith('explore'));

  // Responsive grid calculation
  const getNumColumns = (currentWidth: number) => {
    if (currentWidth >= 1024) return 4; // lg
    if (currentWidth >= 768) return 3; // md
    return 2; // sm and default
  };

  const numColumns = getNumColumns(screenWidth);
  const gutter = 16; // gap-4 in Tailwind is 16px
  const screenPadding = 16; // p-4 in Tailwind is 16px
  const totalHorizontalPadding = screenPadding * 2;
  const totalGutterWidth = (numColumns - 1) * gutter;
  const itemWidth = (screenWidth - totalHorizontalPadding - totalGutterWidth) / numColumns;

  const renderItem = ({ item }: { item: typeof exploreImages[0] }) => (
    <StyledView style={{ width: itemWidth, marginBottom: gutter, marginRight: gutter }}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <StyledView className="relative aspect-square">
            <StyledImage
              source={{ uri: item.imageUrl }}
              alt={item.description}
              className="w-full h-full object-cover"
              resizeMode="cover"
              // No direct hover effect in RN, but could add TouchableOpacity with onPress animation
            />
          </StyledView>
        </CardContent>
      </Card>
    </StyledView>
  );

  return (
    <StyledView className="flex-1 bg-background p-4">
      <StyledText className="text-3xl font-bold font-headline mb-6">Explore</StyledText>
      <FlatList
        data={exploreImages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        // Adjust columnWrapperStyle to handle the right margin of the last item in a row
        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between', marginRight: -gutter } : undefined}
      />
    </StyledView>
  );
}

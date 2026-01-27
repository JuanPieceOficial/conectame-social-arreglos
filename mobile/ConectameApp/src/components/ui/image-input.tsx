import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styled } from 'nativewind';
import { cn } from '@/lib/utils';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface ImageInputProps {
  onImageSelected: (dataUri: string | null) => void;
  currentImageUri?: string | null;
  className?: string;
}

export function ImageInput({ onImageSelected, currentImageUri, className }: ImageInputProps) {
  const handleImagePicker = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
        onImageSelected(null);
      } else if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          onImageSelected(`data:${asset.type};base64,${asset.base64}`);
        } else {
          onImageSelected(null);
        }
      }
    } catch (error) {
      console.error('Error launching image library:', error);
      onImageSelected(null);
    }
  };

  return (
    <StyledView
      className={cn(
        "flex w-full rounded-md border border-input bg-background p-3",
        "items-center justify-center",
        className
      )}
    >
      {currentImageUri ? (
        <StyledView className="relative w-full aspect-video items-center justify-center">
          <StyledImage source={{ uri: currentImageUri }} className="w-full h-full object-contain rounded-md" resizeMode="contain" />
          <StyledTouchableOpacity
            onPress={() => onImageSelected(null)}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
          >
            <MaterialCommunityIcons name="close" size={16} color="white" />
          </StyledTouchableOpacity>
        </StyledView>
      ) : (
        <StyledTouchableOpacity
          onPress={handleImagePicker}
          className="flex-col items-center justify-center py-4"
        >
          <MaterialCommunityIcons name="image-plus" size={32} color="hsl(var(--muted-foreground))" />
          <StyledText className="text-muted-foreground mt-2">Tap to select image</StyledText>
        </StyledTouchableOpacity>
      )}
    </StyledView>
  );
}

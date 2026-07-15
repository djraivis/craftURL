export type CardType = 'landscape' | 'portrait' | 'square' | 'modal';

/**
 * Injects a UKTV Cloudinary named transformation into an image URL
 * to serve a smaller resized variant.
 *
 * Input:  https://uktv-res.cloudinary.com/image/upload/v1715175388/bt1fptxjcrhgxuqc4lzk.jpg
 * Output: https://uktv-res.cloudinary.com/image/upload/t_house_number_tool_card_square/v1715175388/bt1fptxjcrhgxuqc4lzk.jpg
 */
export function transformImageUrl(
  fullSizedImage: string,
  orientation: CardType = 'landscape'
): string {
  if (!fullSizedImage) return '';
  if (fullSizedImage.includes(`t_house_number_tool_card_`)) {
    return fullSizedImage;
  }
  return fullSizedImage.replace(
    '/upload/',
    `/upload/t_house_number_tool_card_${orientation}/`
  );
}

/** Thumb for content search result (square card). */
export function toCloudinaryThumbUrl(
  url: string | null | undefined,
  orientation: CardType = 'square'
): string | null {
  if (!url) return null;
  const transformed = transformImageUrl(url, orientation);
  return transformed || null;
}

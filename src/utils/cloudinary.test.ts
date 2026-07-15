import { describe, expect, it } from 'vitest';
import { toCloudinaryThumbUrl, transformImageUrl } from './cloudinary';

describe('transformImageUrl', () => {
  it('injects the named house_number_tool_card transform', () => {
    expect(
      transformImageUrl(
        'https://uktv-res.cloudinary.com/image/upload/v1715175388/bt1fptxjcrhgxuqc4lzk.jpg',
        'landscape'
      )
    ).toBe(
      'https://uktv-res.cloudinary.com/image/upload/t_house_number_tool_card_landscape/v1715175388/bt1fptxjcrhgxuqc4lzk.jpg'
    );
  });

  it('defaults to landscape', () => {
    expect(
      transformImageUrl(
        'https://uktv-res.cloudinary.com/image/upload/v1/abc.jpg'
      )
    ).toContain('t_house_number_tool_card_landscape');
  });
});

describe('toCloudinaryThumbUrl', () => {
  it('uses square for content thumbs', () => {
    expect(
      toCloudinaryThumbUrl(
        'https://uktv-res.cloudinary.com/image/upload/v1602846492/vsn3r77upgsz78jbz4zr.jpg'
      )
    ).toBe(
      'https://uktv-res.cloudinary.com/image/upload/t_house_number_tool_card_square/v1602846492/vsn3r77upgsz78jbz4zr.jpg'
    );
  });

  it('returns null for empty input', () => {
    expect(toCloudinaryThumbUrl(null)).toBeNull();
  });
});

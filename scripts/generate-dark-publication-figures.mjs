import { access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const root = process.cwd();
const assetDirectory = path.join(root, 'src/pages/research_publications_mdx');

const DARK_CANVAS = [23, 28, 35];
const LIGHT_INK = [216, 226, 239];

const figures = [
  { file: 'anu_logo_0.png', preserve: [] },
  {
    file: 'cvpr2023_0_colab.png',
    preserve: [
      [116, 24, 308, 140],
      [459, 24, 650, 139],
    ],
  },
  {
    file: 'eccv2024_0_colab.png',
    preserve: [
      [60, 88, 268, 295],
      [279, 88, 489, 295],
      [502, 88, 707, 295],
    ],
  },
  { file: 'eccv2026_straight_path_flow_matching.png', preserve: [] },
  {
    file: 'emnlp2026_mango.png',
    preserve: [
      [0, 27, 187, 313],
      [438, 14, 497, 139],
    ],
  },
  { file: 'flowertune.png', preserve: [] },
  {
    file: 'frame-wise_conditioning.png',
    preserve: [
      [84, 109, 218, 194],
      [553, 36, 678, 114],
      [553, 116, 678, 193],
      [553, 195, 678, 282],
    ],
  },
  {
    file: 'iccv2021_0.png',
    preserve: [
      [35, 67, 225, 230],
      [312, 67, 512, 230],
      [528, 67, 730, 230],
    ],
  },
  {
    file: 'iccv2023_0_colab.png',
    preserve: [
      [250, 31, 305, 101],
      [232, 149, 323, 267],
      [419, 29, 507, 115],
      [419, 173, 507, 258],
      [590, 105, 664, 199],
    ],
  },
  {
    file: 'tmlr2024_0.png',
    preserve: [
      [24, 29, 112, 97],
      [128, 29, 195, 97],
      [223, 29, 289, 97],
      [305, 29, 352, 97],
      [366, 29, 416, 97],
      [432, 29, 529, 97],
      [550, 29, 636, 97],
      [649, 29, 744, 97],
      [49, 132, 96, 194],
      [131, 132, 196, 194],
      [222, 132, 303, 194],
      [321, 132, 418, 194],
      [446, 132, 530, 194],
      [552, 132, 617, 194],
      [637, 132, 745, 194],
    ],
  },
  {
    file: 'wacv2024_0.png',
    preserve: [
      [29, 83, 214, 218],
      [555, 83, 741, 218],
    ],
  },
];

const darkFilename = (filename) => filename.replace(/\.png$/u, '_dark.png');

const isInsideRectangle = (x, y, [left, top, right, bottom]) => (
  x >= left && x < right && y >= top && y < bottom
);

const mix = (start, end, amount) => Math.round(start + ((end - start) * amount));

const remapPixel = (red, green, blue) => {
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const chroma = maximum - minimum;
  const luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
  const saturation = maximum === 0 ? 0 : chroma / maximum;
  const isCanvas = luminance >= 246;
  const isNeutral = chroma <= 25 || saturation <= 0.12;

  if (isCanvas || isNeutral) {
    const inkAmount = Math.pow((255 - luminance) / 255, 0.9);
    return [
      mix(DARK_CANVAS[0], LIGHT_INK[0], inkAmount),
      mix(DARK_CANVAS[1], LIGHT_INK[1], inkAmount),
      mix(DARK_CANVAS[2], LIGHT_INK[2], inkAmount),
    ];
  }

  // Semantic colors retain their hue. Only very dark colors receive a small
  // luminance lift so arrows and brand marks remain legible on charcoal.
  if (luminance < 52) {
    const lift = (52 - luminance) / 260;
    return [
      mix(red, 230, lift),
      mix(green, 234, lift),
      mix(blue, 240, lift),
    ];
  }

  return [red, green, blue];
};

const assertProtectedPixels = ({ original, generated, width, channels, rectangles, file }) => {
  for (const [left, top, right, bottom] of rectangles) {
    for (let y = top; y < bottom; y += 1) {
      for (let x = left; x < right; x += 1) {
        const offset = ((y * width) + x) * channels;

        for (let channel = 0; channel < channels; channel += 1) {
          if (original[offset + channel] !== generated[offset + channel]) {
            throw new Error(`${file}: protected pixel changed at ${x},${y}`);
          }
        }
      }
    }
  }
};

const generateFigure = async ({ file, preserve }) => {
  const sourcePath = path.join(assetDirectory, file);
  const outputPath = path.join(assetDirectory, darkFilename(file));
  await access(sourcePath);

  const { data: original, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const generated = Buffer.from(original);

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (preserve.some((rectangle) => isInsideRectangle(x, y, rectangle))) {
        continue;
      }

      const offset = ((y * info.width) + x) * info.channels;
      const [red, green, blue] = remapPixel(
        original[offset],
        original[offset + 1],
        original[offset + 2],
      );
      generated[offset] = red;
      generated[offset + 1] = green;
      generated[offset + 2] = blue;
    }
  }

  assertProtectedPixels({
    original,
    generated,
    width: info.width,
    channels: info.channels,
    rectangles: preserve,
    file,
  });

  await sharp(generated, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png({ compressionLevel: 9, palette: false })
    .toFile(outputPath);

  const { data: encodedPixels, info: encodedInfo } = await sharp(outputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (encodedInfo.width !== info.width || encodedInfo.height !== info.height) {
    throw new Error(`${file}: generated dimensions do not match the source`);
  }
  assertProtectedPixels({
    original,
    generated: encodedPixels,
    width: encodedInfo.width,
    channels: encodedInfo.channels,
    rectangles: preserve,
    file,
  });

  process.stdout.write(`generated ${path.relative(root, outputPath)}\n`);
};

for (const figure of figures) {
  await generateFigure(figure);
}

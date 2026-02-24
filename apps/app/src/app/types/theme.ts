export interface ThemeState {
  borderRadius: string;
  darkMode: boolean;
  grayScale: string;
  primaryColor: string;
  setBorderRadius: (v: string) => void;
  setDarkMode: (v: ((prev: boolean) => boolean) | boolean) => void;
  setGrayScale: (v: string) => void;
  setPrimaryColor: (v: string) => void;
}

export interface ColorOption {
  hex: string;
  hexDark: string;
  name: string;
}

export type GrayScaleOption = ColorOption;

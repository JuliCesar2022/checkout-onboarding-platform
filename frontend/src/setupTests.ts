import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill TextEncoder and TextDecoder for JSDOM
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Polyfill/Mock import.meta.env for Jest
(global as any).import = {
  meta: {
    env: {
      VITE_API_BASE_URL: "http://localhost:3000/api",
    },
  },
};

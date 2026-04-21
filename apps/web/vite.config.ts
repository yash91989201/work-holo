import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      rsc: {
        enabled: true,
      },
    }),
    rsc(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    nitro({
      preset: "bun",
    }),
  ],
  server: {
    port: 3001,
  },
});

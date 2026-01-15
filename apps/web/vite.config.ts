import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteVersionPlugin } from "./vite-version-plugin";

export default defineConfig({
	plugins: [
		tailwindcss(),
		tanstackRouter({}),
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Work Holo",
				short_name: "WorkHolo",
				description: "Work Holo - PWA Application",
				theme_color: "#0c0c0c",
			},
			pwaAssets: { disabled: false, config: true },
			devOptions: {
				enabled: true,
				navigateFallback: undefined,
			},
			injectManifest: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2}"],
				injectionPoint: undefined,
			},
			srcDir: "src",
			filename: "sw.ts",
			strategies: "injectManifest",
		}),
		viteVersionPlugin(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		chunkSizeWarningLimit: 600,
		rollupOptions: {
			output: {
				manualChunks: {
					// ---------------------------
					// Core Framework
					// ---------------------------
					react: ["react", "react-dom"],

					// ---------------------------
					// TanStack Ecosystem
					// ---------------------------
					tanstack: [
						"@tanstack/react-query",
						"@tanstack/react-query-devtools",
						"@tanstack/react-router",
						"@tanstack/react-router-devtools",
						"@tanstack/react-table",
						"@tanstack/react-virtual",
						"@tanstack/react-form",
						"@tanstack/react-db",
					],

					// ---------------------------
					// Base UI
					// ---------------------------
					baseui: ["@base-ui/react"],

					// ---------------------------
					// ORPC
					// ---------------------------
					orpc: ["@orpc/client", "@orpc/server", "@orpc/tanstack-query"],

					// ---------------------------
					// Editor (TIPTAP)
					// ---------------------------
					tiptap: [
						"@tiptap/react",
						"@tiptap/starter-kit",
						"@tiptap/suggestion",
						"@tiptap/extension-image",
						"@tiptap/extension-mention",
						"@tiptap/extension-bubble-menu",
						"@tiptap/extension-placeholder",
						"@tiptap/extension-underline",
					],

					// ---------------------------
					// UI / Utility Libraries
					// ---------------------------
					ui: [
						"class-variance-authority",
						"clsx",
						"tailwind-merge",
						"sonner",
						"lucide-react",
						"vaul",
						"embla-carousel-react",
						"react-resizable-panels",
						"cmdk",
						"next-themes",
						"input-otp",
						"frimousse",
						"tippy.js",
						"@uidotdev/usehooks",
					],

					// ---------------------------
					// Forms & Validation
					// ---------------------------
					forms: ["zod"],

					// ---------------------------
					// Data Handling / Utils
					// ---------------------------
					utils: [
						"date-fns",
						"dompurify",
						"html-react-parser",
						"react-lazy-load-image-component",
						"react-dropzone",
					],

					// ---------------------------
					// Charts
					// ---------------------------
					charts: ["recharts"],

					// ---------------------------
					// Auth
					// ---------------------------
					auth: ["better-auth"],

					// ---------------------------
					// Supabase
					// ---------------------------
					supabase: ["@supabase/supabase-js"],

					// ---------------------------
					// Electric SQL / Local-first DB
					// ---------------------------
					electric: ["@tanstack/electric-db-collection"],

					// ---------------------------
					// State Management
					// ---------------------------
					state: ["zustand"],

					// ---------------------------
					// Other functional deps
					// ---------------------------
					calendar: ["react-day-picker"],
				},
			},
		},
	},
});

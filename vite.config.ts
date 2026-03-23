import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { APP_PORT } from "./src/config/config";

export default defineConfig({
	plugins: [vue(), tailwindcss()],
	server: {
		port: APP_PORT
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	}
});

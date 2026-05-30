import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { APP_PORT, PROXY_PORT } from "./src/config/config";
import basicSsl from '@vitejs/plugin-basic-ssl'

const isShared = process.env.VITE_SHARED === "true";

export default defineConfig({
	plugins: [
		vue(), 
		tailwindcss(), 
		isShared && basicSsl()
	],
	server: {
		port: APP_PORT,
		host: isShared,
		proxy: {
			"/pxy": {
				target: `http://localhost:${PROXY_PORT}`,
				changeOrigin: true,
			}
		}
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	}
});

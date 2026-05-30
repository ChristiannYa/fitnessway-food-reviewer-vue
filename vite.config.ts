import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { APP_PORT, PROXY_PORT } from "./src/config/config";
// import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
	plugins: [
		vue(), 
		tailwindcss(), 
		// basicSsl()
	],
	server: {
		port: APP_PORT,
		host: false,
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

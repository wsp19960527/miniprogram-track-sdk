/// <refrence types="vitest" />
import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "track-sdk",
			fileName: "index",
		},
		rollupOptions: {
			external: ["wx"],
			output: {
				globals: {
					wx: "wx",
				},
			},
		},
	},

	plugins: [
		dts({
			entryRoot: "src",
			outDir: "dist/types",
			rollupTypes: true, // ✅ 合并为一个 .d.ts 文件
			include: ["src/**/*.ts", "src/**/*.d.ts"],
			copyDtsFiles: true, // 确保复制 .d.ts 文件到输出目录
		}),
	],
});

import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
  env: {
    frontend_port: process.env.FRONTEND_PORT,
    login_url: "/login",
    products_url: "/products",
  },
});

// Bootstrap the HTTP server process.
// - Loads environment with dotenv
// - Creates the Express app
// - Starts listening on the configured port
import "dotenv/config";
import { env } from "./config/env";
import { createApp } from "./app";

async function bootstrap() {
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});


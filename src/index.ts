import { server } from "./config/server.js";
import { adminJS } from "./config/adminjs.js";

async function main() {
                    
  try {
    await server.listen({ port: parseInt(process.env.PORT!), host: process.env.HOST }, () => {
      console.log(`AdminJS started on http://localhost:${process.env.PORT}${adminJS.options.rootPath}`)
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
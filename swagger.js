import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Trivia API",
    description: "API for a trivia game",
  },
  host: "localhost:3000",
  schemes: ["http"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/routes/index.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);

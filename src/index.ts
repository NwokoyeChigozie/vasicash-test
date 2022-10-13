import "dotenv/config";
import "module-alias/register";
import validateEnv from "@/utils/validateEnv";
import App from "./app";
import TopicController from "@/resources/topic/topic.controller";

validateEnv();

const app = new App([new TopicController()], Number(process.env.PORT));

app.listen();

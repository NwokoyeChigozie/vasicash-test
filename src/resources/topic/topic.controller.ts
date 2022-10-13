import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validateTopic from "@/resources/topic/validation/topic.validate";
import TopicService from "@/resources/topic/topic.service";

class UserController implements Controller {
    public path = "/";
    public router = Router();
    private topicService = new TopicService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`/topics`, this.getTopics);
        this.router.post(
            `/topics`,
            validationMiddleware(validateTopic.create),
            this.creatTopic
        );
        this.router.post(
            `/subscribe/:topic_slug`,
            validationMiddleware(validateTopic.subscribe),
            this.subscribeToTopic
        );
        this.router.post(
            `/publish/:topic_slug`,
            validationMiddleware(validateTopic.publish),
            this.publishToTopic
        );
        this.router.post(
            `/ping`,
            validationMiddleware(validateTopic.ping),
            this.receivePing
        );
    }

    private receivePing = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { topic, data } = req.body;

            console.log(
                `I got notified of a publishment. Topic: ${topic}, and data: ${data}`
            );

            res.status(200).json({});
        } catch (error: any) {
            console.log(error);
        }
    };

    private getTopics = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const topics = await this.topicService.getTopics();

            res.status(200).json({ topics });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private creatTopic = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name } = req.body;

            const topic = await this.topicService.createTopic(name);

            res.status(201).json({ topic });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private subscribeToTopic = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { url } = req.body;
            const topicSlug = req.params["topic_slug"];

            const topic = await this.topicService.getTopicBySlug(topicSlug);

            const subscriber = await this.topicService.createSubscriber(
                url,
                topic.name
            );

            res.status(201).json({
                url: subscriber.url,
                topic: subscriber.topic,
            });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private publishToTopic = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { data } = req.body;
            const topicSlug = req.params["topic_slug"];

            const topicData = await this.topicService.getTopicBySlug(topicSlug);

            if (!topicData.name) {
                next(new HttpException(400, "topic not found"));
            }

            const subscribers = await this.topicService.getSubscribersByTopic(
                topicData.name
            );

            const message = await this.topicService.createTopicData(
                topicData.name,
                data
            );
            console.log("req");
            console.log(data);
            console.log(message);
            console.log(message.data);
            console.log("req");

            this.topicService.fowardToSubscribers(
                subscribers,
                topicData,
                message
            );

            res.status(201).json({
                topic: topicData.name,
                data: data,
            });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default UserController;

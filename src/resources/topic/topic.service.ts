import TopicModel from "@/resources/topic/models/topic.model";
import SubscriberModel from "@/resources/topic/models/subscriber.model";
import Topic from "./interfaces/topic.interface";
import requestObject from "./interfaces/request.interface";
import { Types } from "mongoose";
import messageModel from "./models/message.model";
import Message from "./interfaces/message.interface";
import Subscriber from "./interfaces/subscriber.interface";
// import fetch from "node-fetch";
// const fetch = require("node-fetch");
var axios = require("axios");

class TopicService {
    private topic = TopicModel;
    private subscriber = SubscriberModel;
    private message = messageModel;

    public async createTopic(name: string): Promise<any | Error> {
        try {
            const topic = await this.topic.create({
                name,
            });

            return topic;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async createSubscriber(
        url: string,
        topicName: string
    ): Promise<any | Error> {
        try {
            const subscriber = await this.subscriber.create({
                url,
                topic: topicName,
            });

            return subscriber;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async createTopicData(
        topicName: string,
        publishData: any
    ): Promise<any | Error> {
        try {
            const message = await this.message.create({
                topic: topicName,
                data: publishData,
            });

            return message;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getTopicBySlug(slug: string): Promise<any | Error> {
        try {
            const topic = await this.topic
                .findOne({
                    slug,
                })
                .exec();

            return topic;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getTopicByName(name: string): Promise<any | Error> {
        try {
            const topic = await this.topic
                .findOne({
                    name,
                })
                .exec();

            return topic;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getTopics(): Promise<any | Error> {
        try {
            const topics = await this.topic.find({});

            return topics;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getSubscribersByTopic(
        topicName: string
    ): Promise<any | Error> {
        try {
            const subscribers = await this.subscriber.find({
                topic: topicName,
            });
            return subscribers;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async fowardToSubscribers(
        subscribers: (Subscriber & {
            _id: Types.ObjectId;
        })[],
        topicData:
            | Topic & {
                  _id: Types.ObjectId;
              },
        message: Message & {
            _id: Types.ObjectId;
        }
    ): Promise<any | Error> {
        subscribers.map(async (val, index) => {
            let payload: requestObject = {
                topic: topicData.name,
                data: message.data,
            };
            console.log(payload);

            await this.sendRequest(payload, "POST", val.url);
        });
    }

    private async sendRequest(
        data: requestObject,
        method: string,
        target: string
    ): Promise<void> {
        let body = JSON.stringify(data);
        var config = {
            method: method,
            url: target,
            headers: {
                "Content-Type": "application/json",
            },
            data: body,
        };

        axios(config)
            .then(function (response: { data: any }) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error: any) {
                console.log(error);
            });
    }
}

export default TopicService;
function sendRequest() {
    throw new Error("Function not implemented.");
}
function data(data: any, arg1: string, url: any) {
    throw new Error("Function not implemented.");
}

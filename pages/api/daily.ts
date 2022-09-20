// noinspection JSUnusedGlobalSymbols

import clientPromise from "../../lib/mongodb";
import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {date} = req.query;
    const dataModel = {
        "date": date,
        "macro": {
            "calories": {"label": "Calories", "total": 0, "target": 0, "variant": 0},
            "carbs": {"label": "Carbs", "total": 0, "target": 0, "variant": 0},
            "fat": {"label": "Fat", "total": 0, "target": 0, "variant": 0},
            "protein": {"label": "Protein", "total": 0, "target": 0, "variant": 0}
        }
    }
    const client = await clientPromise;
    const db = client.db("mct");
    switch (req.method) {
        case "POST":
            let data = req.body;
            data = JSON.parse(data);
            console.log(data);
            await db.collection('daily').updateOne(
                {date: data.date},
                {$set: data},
                {upsert: true}
            )
            res.status(200).json({success: true});
            break;
        case "GET":
            let daily;
            if (date) {
                daily = await db.collection("daily").findOne({date});
                if (daily == null) {
                    daily = dataModel
                }
            } else {
                daily = await db.collection('daily').findOne()
                if (daily == null) {
                    daily = dataModel
                }
            }

            //not including "_id" in the response:
            const toResponse = {
                "date": daily.date,
                "macro": daily.macro
            }
            res.json(toResponse);
            break;
    }
}

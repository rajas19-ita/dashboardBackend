require("dotenv").config();
require("./db/mongoose");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const projectionModel = require("./models/projection");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/insights", async (req, res) => {
    try {
        const pageSize = 10;

        const pageNumber = req.query.page || 1;
        const selectedOptions =
            JSON.parse(decodeURIComponent(req.query.selectedOptions)) || {};

        const skip = (pageNumber - 1) * pageSize;

        const totalCount = await projectionModel.countDocuments(
            selectedOptions
        );
        const pageCount = Math.ceil(totalCount / pageSize);

        const insights = await projectionModel
            .find(selectedOptions)
            .select(["insight"])
            .sort({ published: -1 })
            .skip(skip)
            .limit(pageSize);

        if (!insights) {
            return res.status(404).send({ message: "not found" });
        }

        res.status(200).send({ insights, pageCount });
    } catch (e) {
        res.status(400).send({ err: e.message });
    }
});

app.get("/insight/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const insight = await projectionModel.findById(id);

        if (!insight) {
            return res.status(404).send({ message: "not found" });
        }
        res.status(200).send(insight);
    } catch (e) {
        res.status(400).send({ err: e.message });
    }
});

app.post("/options/:section", async (req, res) => {
    try {
        const section = req.params.section || "sector";
        var selectedOptions = req.body || null;

        if (selectedOptions) {
            delete selectedOptions[section];
        }

        const options = await projectionModel.distinct(
            section,
            selectedOptions
        );

        res.status(200).send({ [section]: options });
    } catch (e) {
        res.status(400).send({ err: e.message });
    }
});

app.get("/insightT", async (req, res) => {
    try {
        const groupBy = req.query.groupBy || "sector";
        const matchString = req.query.match || null;
        let pipeline = [];

        if (matchString) {
            const match = JSON.parse(decodeURIComponent(matchString));
            pipeline.push({
                $match: {
                    [match.category]: match.value,
                },
            });
        }

        pipeline.push(
            {
                $group: {
                    _id: `$${groupBy}`,
                    insightT: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    [groupBy]: "$_id",
                    insightT: 1,
                },
            }
        );

        const data = await projectionModel.aggregate(pipeline);

        if (!data) {
            return res.status(404).send({ data: "not found" });
        }

        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({ e: e.message });
    }
});

app.listen(PORT, () => {
    console.log("server is listening on port " + PORT);
});

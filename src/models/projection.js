const mongoose = require("mongoose");

const projectionSchema = new mongoose.Schema({
    end_year: { type: Number, default: null },
    intensity: { type: Number, default: null },
    sector: { type: String, default: "N/A" },
    topic: { type: String, default: "N/A" },
    insight: { type: String, default: null },
    url: { type: String, default: null },
    region: { type: String, default: "N/A" },
    start_year: { type: Number, default: null },
    impact: { type: Number, default: null },
    added: { type: Date, default: null },
    published: { type: Date, default: null },
    country: { type: String, default: "N/A" },
    relevance: { type: Number, default: null },
    pestle: { type: String, default: "N/A" },
    source: { type: String, default: null },
    title: { type: String, default: null },
    likelihood: { type: Number, default: null },
});

const projectionModel = mongoose.model("Projection", projectionSchema);

module.exports = projectionModel;

const express = require("express");
const { config } = require("dotenv");
const multer = require("multer");
const pdf = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
const { corsOptions } = require("./config/corsOptions");

config();
console.log(process.env.NODE_ENV);
const port = process.env.PORT || 3001;

const app = express();

app.use(cors(corsOptions));

const storage = multer.memoryStorage();

app.use(express.json());

const upload = multer({ storage: storage });

let data = null;

// Endpoint to upload PDF file and get feedback
app.post("/api/upload", upload.single("resume"), async (req, res) => {
  // Check if the file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  const { role, description } = req.body;
  if (!role) {
    return res.status(400).json({ message: "Specify a role" });
  }

  try {
    // Access the file buffer (in memory)
    const dataBuffer = req.file.buffer;
    // Extract text from PDF
    data = await pdf(dataBuffer);

    const resumeText = data.text.trim();

    // Generate feedback using Gemini API
    const resPositives = await genAI(
      `assume yourself as a ATS for the job role : ${role} and check the resume suits for the job description : ${description}, return me a json object containing the positives about the resume in max-10 min-0 (according to the resume) concise points, the name of the array should be "positives" (all small characters), JSON should be parsable response and the response should not contain any subheading. Make sure ',' or ']' after array element. Don't make any typos or JSON syntax errors. Please give me production quality json without any errors. Here is the resume: ${resumeText}`
    );

    const parsedPositives = parsed(resPositives);

    const resNegatives = await genAI(
      `assume yourself as a ATS for the job role : ${role} and check the resume suits for the job description : ${description}, return me a json object containing the negatives about the resume in max-10 min-0 (according to the resume) concise points, the name of the array should be "negatives" (all small characters), JSON should be parsable response and the response should not contain any subheading. Make sure ',' or ']' after array element. Don't make any typos or JSON syntax errors. Please give me production quality json without any errors. Here is the resume: ${resumeText}`
    );

    const parsedNegatives = parsed(resNegatives);

    const positives = parsedPositives.positives;
    const negatives = parsedNegatives.negatives;

    const resumeScore = await genAI(
      `assume yourself as a ATS, give me score for the resume out of 100 based on the positives : ${positives} and negatives:${negatives}, response type should be integer, no other texts or suggestions allowed. The resume: ${resumeText}`
    );

    const score = resumeScore.text();

    return res.status(200).json({
      score: score.trim(),
      positives: positives,
      negatives: negatives,
    });
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    res.status(500).json({ err: "Error extracting text from PDF" });
  }
});

function parsed(response) {
  const jsonString = response.text().replace(/[`]/g, "");
  const startIndex = jsonString.indexOf("{");
  const endIndex = jsonString.lastIndexOf("}");
  const validJsonString = jsonString.slice(startIndex, endIndex + 1);
  const parsedData = JSON.parse(validJsonString);
  return parsedData;
}

// Gemini API
async function genAI(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.0-pro",
    generation_config: { response_mime_type: "application/json" },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response;
}

app.listen(port, () => {
  console.log(`listening on ${port}`);
});

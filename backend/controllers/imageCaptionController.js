import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Google Generative AI setup
const genAI = new GoogleGenerativeAI(process.env.CAPTION_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

// Route: Upload Image & Convert to Text
export const imageToAcption = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imagePath = req.file.path;
    const imagePart = fileToGenerativePart(imagePath, req.file.mimetype);

    const prompt = "image releted caption"; 

    const result = await model.generateContent([prompt, imagePart]);
    let text = result.response.text() 

    fs.unlinkSync(imagePath);

    res.json({ caption: text, success: true });
  } catch (error) {
    console.error("Error generating caption:", error);
    res.status(500).json({ error: error.message });
  }
};
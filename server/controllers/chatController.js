import Product from "../models/Product.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body; // <--- 1. Get History

    // 2. Fetch Inventory
    const products = await Product.find({})
      .select("name price brand category subcategory _id countInStock color")
      .limit(100);

    // 3. Create Data String
    const productData = products.map(p => {
      let colorContext = p.color;
      if (p.color.toLowerCase().includes("bred")) colorContext += " (Red/Black)";
      if (p.color.toLowerCase().includes("crimson")) colorContext += " (Red)";
      return `ID: ${p._id} | Name: ${p.name} | Brand: ${p.brand} | Price: ₹${p.price} | Cat: ${p.subcategory} | Color: ${colorContext} | Stock: ${p.countInStock}`;
    }).join("\n");

    // 4. Format Chat History for the AI
    // We take the last 6 messages to give context without overloading tokens
    const conversationContext = history?.slice(-6).map(msg => {
        return `${msg.role === "user" ? "Customer" : "Vexi"}: ${msg.content}`;
    }).join("\n") || "";

    // 5. Updated Prompt with Context
    const systemPrompt = `
      You are 'Vexi', the intelligent sales assistant for the Velix shoe store.
      
      *** CURRENT LIVE INVENTORY ***
      ${productData}
      
      *** CONVERSATION HISTORY ***
      ${conversationContext}
      
      *** YOUR INSTRUCTIONS ***
      1. **Context Awareness:** Use the conversation history to understand what the user is referring to. If they say "cheapest", look at the *last* shoes you discussed.
      2. **Strict Truth:** Only sell items listed in the inventory.
      3. **Formatting:** Markdown links for products: [Product Name](/product/ID).
      4. **Color Search:** Be flexible with colors (Red = Bred, Crimson, etc).
      5. **Conciseness:** Keep it short (2-3 sentences).
      
      *** NEW MESSAGE ***
      Customer: "${message}"
      Vexi:
    `;

    // 6. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: "Error processing chat request" });
  }
};
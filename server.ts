import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize server-side Gemini client with recommended telemetry headers
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Secure API endpoint for chatbot communication (proxies request to Gemini)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Context-aware instruction for the procurement assistant
      const systemInstruction = `You are "Hita", the premium AI Procurement and Technical Assistant of Hitanshi Trading Corporation.
Your demeanor is highly professional, helpful, accurate, polite, and responsive. You represent a company that is a major, certified industrial player in HDPE and PVC pipeline manufacturing.

About Hitanshi Trading Corporation:
- Location/HQ: Plot 42, MIDC Phase III, Avadhan, Dhule, Maharashtra 424006.
- Strategic Status: Authorized manufacturers and premium wholesale traders.
- Main Products & Catalog:
  1. HDPE Pipes (High-Density Polyethylene): High durability, chemical resistance, for water supply, industrial sewage, micro-irrigation, and municipal drainage. Conform to IS:4984 standards. Grades include PE80, PE100 with PN ratings (PN2.5, PN4, PN6, PN10, PN16, up to high pressure PN20).
  2. MDPE Pipes (Medium-Density Polyethylene): For city gas distribution networks and specialized water supplies. Conform to IS:14885 standards.
  3. PVC & UPVC Pipes: Strong, lightweight for domestic plumbing, agriculture, column/casing lines, and tube wells.
  4. Industrial Water/Chemical Storage Tanks: Heavy-duty multi-layer polymer tanks.
  5. Industrial Pumping Systems: Pumps and valves for large irrigation or plumbing corridors.
- Key Trust Credentials: ISO 9001:2015 certified production processes, MSME Registered, premium grade tested materials, and rigorous Quality Assurance inspection.
- Direct-Factory Supply & Logistics: Operations run out of our Dhule MIDC hub. We supply with rapid dispatch throughout Maharashtra (Dhule, Mumbai, Pune, Nagpur, Nashik, Aurangabad), Madhya Pradesh (Indore, Bhopal), Gujarat (Surat, Vadodara), and adjacent regional municipalities.
- Support options: Procurement officers can add specific products/BOQ to their "Active RFQ" basket in the app interface, calculate dimensions using our built-in Specs Calculator, or chat instantly with the Sales Desk via WhatsApp at +91 7263014111.

Conversation Guidelines:
- Keep responses concise, clear, and perfectly structured with markdown list symbols or brief bullet points where appropriate.
- When users ask about pricing or detailed quotes, instruct them to add items to their Quote Request modal in the UI or offer the quick contact numbers/WhatsApp link (+91 7263014111).
- If asked technical questions like SDR (Standard Dimension Ratio), weight estimation, standard pipe sizes (e.g. 20mm up to 1000mm) or standards, provide precise answers based on industrial pipe specs.
- If the user greets you or asks who you are, make a warm, executive-level introduction. Let them know you're here to assist with industrial pipeline bids and commercial procurement requisitions.`;

      // Map roles correctly for the SDK content formats
      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      // Basic Text Task Model
      const modelName = "gemini-3.5-flash";

      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error in Server:", error);
      res.status(500).json({ error: error?.message || "Failed to generate AI response." });
    }
  });

  // Vite middleware setup for Development or Static assets in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

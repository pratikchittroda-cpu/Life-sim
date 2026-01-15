import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, SimulationResult } from '../types';

const apiKey = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey });

const simulationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    assumptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of assumptions made about the user's missing data or context."
    },
    timeline: {
      type: Type.ARRAY,
      description: "Simulation outcomes at 1, 3, 5, and 10 years.",
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.INTEGER, description: "The year offset (1, 3, 5, or 10)" },
          label: { type: Type.STRING, description: "Short title for this phase (e.g., 'The Honeymoon Phase')" },
          financialStability: { type: Type.INTEGER, description: "Score 0-100" },
          mentalHealth: { type: Type.INTEGER, description: "Score 0-100" },
          relationships: { type: Type.INTEGER, description: "Score 0-100" },
          regretProbability: { type: Type.INTEGER, description: "Score 0-100" },
          narrative: { type: Type.STRING, description: "Detailed description of life at this stage. Explain WHY." },
          hiddenRisks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Unexpected risks that emerge here." }
        },
        required: ["year", "label", "financialStability", "mentalHealth", "relationships", "regretProbability", "narrative", "hiddenRisks"]
      }
    },
    keyForks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          decisionPoint: { type: Type.STRING },
          implication: { type: Type.STRING }
        }
      },
      description: "Critical turning points or irreversible forks in the road."
    },
    bestCase: { type: Type.STRING, description: "Realistic best outcome." },
    worstCase: { type: Type.STRING, description: "Realistic worst outcome." },
    brutalTruths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Harsh realities the user might be ignoring."
    },
    alternativeStrategy: { type: Type.STRING, description: "A counter-intuitive alternative path they should consider." }
  },
  required: ["assumptions", "timeline", "keyForks", "bestCase", "worstCase", "brutalTruths", "alternativeStrategy"]
};

export const runSimulation = async (input: UserInput): Promise<SimulationResult> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a Life Decision Simulation Engine. 
    Your role is NOT to validate the user or make them feel good. 
    Your role is to SIMULATE realistic future outcomes based on behavioral economics, psychology, risk analysis, and compounding effects.

    Rules:
    - Be realistic, borderline cynical. Avoid optimism bias.
    - Highlight compounding effects (debt, bad habits, lost time) and irreversible consequences.
    - Simulate outcomes at 1, 3, 5, and 10 years.
    - Explain WHY outcomes happen.
    - If inputs are vague, make logical probabilistic assumptions and list them.
    - Return RAW JSON data only.
  `;

  const prompt = `
    User Profile:
    - Age: ${input.currentAge}
    - Decision to Simulate: ${input.decision}
    - Current Context/Status: ${input.currentStatus}
    - Risk Tolerance: ${input.riskTolerance}
    - Stated Goals: ${input.goals}

    Simulate the trajectory of this life decision.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: simulationSchema,
        temperature: 0.4, // Keep it grounded
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from simulation engine");
    
    return JSON.parse(text) as SimulationResult;
  } catch (error) {
    console.error("Simulation failed:", error);
    throw error;
  }
};
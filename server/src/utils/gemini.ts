import { GoogleGenAI, Type } from '@google/genai';

export interface AiAssessmentResult {
  hasRamp: boolean | null;
  rampWidthAdequate: boolean | null;
  hasSteps: boolean | null;
  doorWidth: 'wide' | 'narrow' | 'unknown';
  confidence: number;
  recommendations: string[];
}

export async function assessImageAccessibility(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<AiAssessmentResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('AI assessment is unavailable because GEMINI_API_KEY is not configured on the server.');
  }
  if (!imageBase64) {
    throw new Error('An entrance image is required for an AI assessment.');
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const prompt = `Analyze this entrance/building photo for physical accessibility for people with disabilities (wheelchair users, visually impaired, mobility aids).
Assess:
1. Is a wheelchair accessible ramp visible? Answer yes, no, or unknown if the entrance area is not clearly shown.
2. Is the ramp width visibly adequate (at least 900mm / 3 feet)? Answer unknown without a reliable visual scale.
3. Are steps or stairs visible without an alternative level/ramp path? Answer unknown if the entrance area is not clearly shown.
4. Is the entrance door width visibly 'wide' (>= 800mm clear opening) or 'narrow'? Answer unknown without a reliable visual reference.
5. Confidence rating between 0.0 and 1.0, reflecting only what can be seen in this image.
6. Actionable recommendations based only on visible barriers. Do not claim that unseen features are present or absent.
Return ONLY valid JSON matching the schema.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasRamp: {
              type: Type.STRING,
              enum: ['yes', 'no', 'unknown'],
              description: 'Whether an accessible ramp is visibly present; use unknown if not clear.',
            },
            rampWidthAdequate: {
              type: Type.STRING,
              enum: ['yes', 'no', 'unknown'],
              description: 'Whether the ramp width visibly meets wheelchair needs; use unknown without a scale.',
            },
            hasSteps: {
              type: Type.STRING,
              enum: ['yes', 'no', 'unknown'],
              description: 'Whether obstructing steps are visible; use unknown if the entrance is not clear.',
            },
            doorWidth: {
              type: Type.STRING,
              enum: ['wide', 'narrow', 'unknown'],
              description: 'Visible door clearance; use unknown without a reliable visual reference.',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence rating between 0 and 1.',
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of practical recommendations for accessibility improvements.',
            },
          },
          required: [
            'hasRamp',
            'rampWidthAdequate',
            'hasSteps',
            'doorWidth',
            'confidence',
            'recommendations',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini');
    }

    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Gemini returned an invalid accessibility assessment.');
    }

    const result = parsed as Record<string, unknown>;
    if (
      !['yes', 'no', 'unknown'].includes(String(result.hasRamp)) ||
      !['yes', 'no', 'unknown'].includes(String(result.rampWidthAdequate)) ||
      !['yes', 'no', 'unknown'].includes(String(result.hasSteps)) ||
      (result.doorWidth !== 'wide' && result.doorWidth !== 'narrow' && result.doorWidth !== 'unknown') ||
      typeof result.confidence !== 'number' ||
      !Number.isFinite(result.confidence) ||
      !Array.isArray(result.recommendations) ||
      !result.recommendations.every((recommendation) => typeof recommendation === 'string')
    ) {
      throw new Error('Gemini returned an incomplete accessibility assessment.');
    }

    const toBooleanOrUnknown = (value: unknown) =>
      value === 'yes' ? true : value === 'no' ? false : null;

    return {
      hasRamp: toBooleanOrUnknown(result.hasRamp),
      rampWidthAdequate: toBooleanOrUnknown(result.rampWidthAdequate),
      hasSteps: toBooleanOrUnknown(result.hasSteps),
      doorWidth: result.doorWidth,
      confidence: Math.round(Math.max(0, Math.min(1, result.confidence)) * 100) / 100,
      recommendations: result.recommendations,
    };
  } catch (error) {
    console.error('Gemini accessibility assessment error:', error);
    throw error;
  }
}

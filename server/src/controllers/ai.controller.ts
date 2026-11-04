import { Request, Response } from 'express';
import { Place } from '../models/Place.js';
import { isDbConnected, memoryStore } from '../config/db.js';
import { assessImageAccessibility } from '../utils/gemini.js';

export async function assessPlace(req: Request, res: Response) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI assessment is unavailable because GEMINI_API_KEY is not configured on the server.',
      });
    }

    const { id } = req.params;
    let base64Image: string = '';
    let mimeType = 'image/jpeg';
    let displayImageUrl = '';

    // Check if multipart file uploaded
    if (req.file) {
      base64Image = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype || 'image/jpeg';
      displayImageUrl = `data:${mimeType};base64,${base64Image.substring(0, 500)}...`; // preview indicator
    } else if (req.body.imageBase64) {
      // Base64 provided directly
      let raw = req.body.imageBase64;
      if (raw.includes(',')) {
        const parts = raw.split(',');
        mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        base64Image = parts[1];
      } else {
        base64Image = raw;
      }
      displayImageUrl = req.body.imageUrl || '';
    } else if (req.body.imageUrl) {
      displayImageUrl = req.body.imageUrl;
      const response = await fetch(req.body.imageUrl);
      if (!response.ok) {
        throw new Error(`Could not load the entrance image (HTTP ${response.status}).`);
      }
      const contentType = response.headers.get('content-type')?.split(';')[0].trim() || '';
      if (!contentType.startsWith('image/')) {
        throw new Error('The selected URL did not return an image.');
      }
      const arrayBuffer = await response.arrayBuffer();
      base64Image = Buffer.from(arrayBuffer).toString('base64');
      mimeType = contentType;
    }

    if (!base64Image) {
      throw new Error('Upload or select an entrance image before requesting an AI assessment.');
    }
    if (!mimeType.startsWith('image/')) {
      throw new Error('The uploaded file must be an image.');
    }

    const assessmentResult = await assessImageAccessibility(base64Image, mimeType);

    const assessmentData = {
      ...assessmentResult,
      assessedAt: new Date(),
      imageUrl: displayImageUrl || undefined,
    };

    // Save to Place document
    if (isDbConnected()) {
      const place = await Place.findById(id);
      if (place) {
        place.aiAssessment = assessmentData;
        await place.save();
      }
    } else {
      const place = memoryStore.places.find((p) => p._id === id);
      if (place) {
        place.aiAssessment = assessmentData;
      }
    }

    return res.json({
      success: true,
      assessment: assessmentData,
    });
  } catch (error: unknown) {
    console.error('assessPlace error:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'AI assessment failed',
    });
  }
}

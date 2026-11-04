import { Request, Response } from 'express';
import { Place } from '../models/Place.js';
import { isDbConnected, memoryStore } from '../config/db.js';
import { assessImageAccessibility } from '../utils/gemini.js';

export async function assessPlace(req: Request, res: Response) {
  try {
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
      // Fetch image from URL or use as reference
      try {
        const response = await fetch(req.body.imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        base64Image = Buffer.from(arrayBuffer).toString('base64');
        mimeType = response.headers.get('content-type') || 'image/jpeg';
      } catch (e) {
        console.warn('Could not fetch external image, using default visual analysis profile');
      }
    }

    if (!base64Image) {
      // If no image is provided, provide a sample entrance scan for demo
      base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }

    // Call Gemini Multimodal analysis
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
  } catch (error: any) {
    console.error('assessPlace error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'AI assessment failed',
    });
  }
}

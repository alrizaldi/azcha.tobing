import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { submitContactForm } from '@/lib/supabase/queries';
import { contactSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate inputs
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.errors.map(err => err.message).join(', '), 
        400
      );
    }
    
    const submission = await submitContactForm(body);
    
    return createResponse({ 
      success: true, 
      submissionId: submission.id 
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to submit contact form', 500);
  }
}
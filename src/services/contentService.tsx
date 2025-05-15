// src/services/contentService.tsx
interface GenerateContentParams {
  contentType: string;
  topic: string;
  keywords: string[];
}

export async function generateContent({ contentType, topic, keywords }: GenerateContentParams) {
  try {
    const response = await fetch('/api/documents/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        contentType,
        topic,
        keywords,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}
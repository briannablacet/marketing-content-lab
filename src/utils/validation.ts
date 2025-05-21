//src/utils/validation.ts

export function validateRequest(competitors: any, userMessages: any): boolean {
    if (
      !Array.isArray(competitors) ||
      !competitors.every(comp => comp.name && comp.url) ||
      !Array.isArray(userMessages) ||
      !userMessages.every(msg => typeof msg === 'string')
    ) {
      return false;
    }
    return true;
  }
  
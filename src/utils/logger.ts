//src/utils/logger.ts


export function logError(endpoint: string, error: any) {
  console.error(`Error in ${endpoint}:`, error);
}

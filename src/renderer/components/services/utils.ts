// Access the Prisma client instance exposed from the main process via the preload script.
// This is the central point for all database interactions in the renderer process.
export const prisma = window.electron.prisma();

/**
 * A centralized error handler for services.
 * Logs the error and returns a structured error response.
 * @param {Error} error - The error object caught.
 * @param {string} functionName - The name of the service function where the error occurred.
 * @returns {{ data: null, error: Error }} - A structured error object.
 */
export const handleServiceError = (error: unknown, functionName: string) => {
  console.error(`Error in ${functionName}:`, error);
  // In a real app, you might want to format the error more gracefully
  // before it reaches the UI.
  return {
    data: null,
    error: (error as any).message || 'An unexpected error occurred.',
  };
};

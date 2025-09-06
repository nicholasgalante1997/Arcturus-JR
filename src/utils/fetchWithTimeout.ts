/**
 * Fetches a resource with a timeout
 * @param {string | URL} url - The URL to fetch
 * @param {RequestInit} options - The RequestInit options to pass to fetch
 * @param {number} [timeoutMs=5000] - The timeout in milliseconds
 *
 * @returns {Promise<Response>} The response from the fetch
 */
export async function fetchWithTimeout(url: string | URL, options: RequestInit = {}, timeoutMs: number = 5000): Promise<Response> {
  // Create a new AbortController instance
  const controller = new AbortController();

  // Get the signal from the controller
  const { signal } = controller;

  // Set up the timeout
  const timeout = setTimeout(() => {
    controller.abort(); // This will trigger an AbortError
  }, timeoutMs);

  // Add the signal to the fetch options
  const fetchOptions = {
    ...options,
    signal
  };

  // Return the fetch promise with timeout handling
  return fetch(url, fetchOptions)
    .then((response) => {
      clearTimeout(timeout); // Clear the timeout if the fetch completes
      return response;
    })
    .catch((error) => {
      clearTimeout(timeout); // Clear the timeout if the fetch fails
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw error; // Re-throw other errors
    });
}

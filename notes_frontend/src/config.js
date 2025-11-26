 // PUBLIC_INTERFACE
 /**
  * Frontend configuration for API endpoints.
  * API_BASE_URL should point to the running backend service.
  * For local development with the provided environment, backend runs on port 3001.
  */
 const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

 export default {
   API_BASE_URL,
 };

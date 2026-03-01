// Health check endpoint is required to check the status
// of the frontend application for deployment pipelines
export default function HealthCheck() {
  return 'ok';
}

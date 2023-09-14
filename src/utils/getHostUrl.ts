export function getHostUrl() {
  const { VERCEL_URL, TUNNEL_URL } = process.env;
  let host = "http://localhost:3000";
  if (TUNNEL_URL) {
    host = `https://${TUNNEL_URL}`;
  }
  if (VERCEL_URL) {
    host = `https://${VERCEL_URL}`;
  }
  return host;
}

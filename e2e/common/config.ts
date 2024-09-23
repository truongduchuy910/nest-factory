import 'dotenv/config';

export const uri = process.env.API || `http://localhost:3000/api/graphql`;

async function getHealth() {
  const response = await fetch('http://localhost:3000/health');
  const json = await response.json();
  return json;
}

export async function waitForHealth() {
  let health = null;
  do {
    health = await getHealth();
  } while (!health.status);
}

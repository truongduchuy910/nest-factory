import 'dotenv/config';

export const uri = process.env.API || `http://localhost:3000/api/graphql`;

async function getHealth() {
  try {
    const response = await fetch('http://localhost:3000/health');
    const json = await response.json();
    return json;
  } catch {
    return null;
  }
}

export async function waitForHealth() {
  let health = null,
    count = 0;
  do {
    health = await getHealth();
  } while (!health?.status && count < 100);
}

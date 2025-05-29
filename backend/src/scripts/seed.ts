// Seeds data into MongoDB from a JSON file, backupping the existing data
import 'dotenv/config';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectToDB, disconnectFromDB } from '@/db/connection';
import Resource from '@/models/resourceSchema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedResources() {
  try {
    await connectToDB();

    const dataPath = path.join(__dirname, '../../data/mental_health_resources.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContent);

    await Resource.deleteMany(); // Clean collection first
    await Resource.insertMany(data.resources);

    console.log('Resource data seeded successfully.');
  } catch (error) {
    console.error('Error seeding resource data:', error);
  } finally {
    await disconnectFromDB();
    process.exit(0);
  }
}

seedResources();

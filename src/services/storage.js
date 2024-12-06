// src/services/storage.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class WishlistStorage {
  constructor() {
    this.filePath = path.join(__dirname, '../../data/wishlist.json');
  }

  async getItems() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.saveItems([]);
        return [];
      }
      throw error;
    }
  }

  async saveItems(items) {
    const dirPath = path.dirname(this.filePath);
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(items, null, 2));
  }

  async addItem(item) {
    const items = await this.getItems();
    const newItem = {
      id: Date.now().toString(),
      ...item,
      totalContributed: 0,
      contributions: [],
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    await this.saveItems(items);
    return newItem;
  }
}
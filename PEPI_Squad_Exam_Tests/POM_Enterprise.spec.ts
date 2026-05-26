import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { LoginPage } from './pages/LoginPage';
import { CompanyPage } from './pages/CompanyPage';
import { TestBuilderPage } from './pages/TestBuilderPage';

dotenv.config();

// 👉 ОПТИМИЗИРАНО ЗА ТВОЯТА СТРУКТУРА: Влизаме в папка 'utils', за да прочетем JSON файла
const testDataPath = path.join(__dirname, 'utils', 'test-data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
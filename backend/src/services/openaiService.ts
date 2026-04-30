import OpenAI from 'openai';
import { PatternCache } from '../models/PatternCache';
import logger from '../utils/logger';
import env from '../config/env';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const TRANSLATION_PROMPT = `You are a financial translator for Indian bank transactions. Convert cryptic bank/UPI/card transaction descriptions into plain, human-readable English.

Rules:
- Keep it short (under 60 characters)
- Identify the merchant, service, or transfer purpose
- Mention payment method briefly if relevant
- Use Indian context (Swiggy, Zomato, PhonePe, Paytm, HDFC, SBI, Jio, etc.)

Examples:
- "UPI/1234567890@okicici/SWIGGY" → "Swiggy food order via UPI"
- "NEFT/HDFC0001234/RENT PAYMENT" → "Rent payment via HDFC NEFT"
- "POS/BIGBAZAAR/MUM/DEBIT CARD" → "Big Bazaar shopping (debit card)"
- "IMPS/9876543210/PHONEPE" → "PhonePe money transfer"
- "ACH/LICHSGFIN/EMI" → "LIC Housing Finance EMI"
- "ECS/HDFCLIFE/PREMIUM" → "HDFC Life insurance premium"
- "NACH/AXISBK/SIP" → "Axis Bank mutual fund SIP"
- "TPT/IRCTC/TRAIN TICKET" → "IRCTC train ticket booking"

Return ONLY the plain language translation, nothing else.`;

const CATEGORY_PROMPT = `You are a financial categorizer for Indian transactions. Given a transaction description, return exactly one category from this list:

Food & Dining, Transport, Shopping, Utilities & Bills, Entertainment, Healthcare, Travel, Education, Groceries, Fuel, EMI & Loans, Insurance, Investment, Transfer, Income, Recharge & Subscriptions, Other

Indian context examples:
- Swiggy/Zomato/Blinkit/BigBasket → Food & Dining or Groceries
- Ola/Uber/Metro/IRCTC/MakeMyTrip → Transport or Travel
- Jio/Airtel/BSNL recharge → Recharge & Subscriptions
- EMI/ECS/NACH/loan → EMI & Loans
- LIC/HDFC Life/Star Health → Insurance
- SIP/mutual fund/stocks → Investment
- Petrol/HP/IOCL/BPCL → Fuel

Return ONLY the category name, nothing else.`;

const normalizePattern = (raw: string): string =>
  raw
    .toUpperCase()
    .replace(/\d{10,}/g, 'XXXXXXXXXX')
    .replace(/[A-Z0-9]+@[A-Z0-9]+/g, 'UPI@ID')
    .replace(/\/[A-Z0-9]{10,}\//g, '/REF/')
    .trim()
    .substring(0, 200);

export const translateAndCategorize = async (
  rawDescription: string
): Promise<{ plainLanguage: string; category: string }> => {
  const normalizedKey = normalizePattern(rawDescription);

  const cached = await PatternCache.findOneAndUpdate(
    { rawPattern: normalizedKey },
    { $inc: { hitCount: 1 } },
    { new: true }
  );

  if (cached) {
    return { plainLanguage: cached.plainLanguage, category: cached.category };
  }

  if (!env.OPENAI_API_KEY) {
    return {
      plainLanguage: rawDescription.substring(0, 60),
      category: 'Other',
    };
  }

  try {
    const [translationRes, categoryRes] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: TRANSLATION_PROMPT },
          { role: 'user', content: `Translate: "${rawDescription}"` },
        ],
        max_tokens: 60,
        temperature: 0.2,
      }),
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: CATEGORY_PROMPT },
          { role: 'user', content: rawDescription },
        ],
        max_tokens: 20,
        temperature: 0,
      }),
    ]);

    const plainLanguage =
      translationRes.choices[0]?.message?.content?.trim() || rawDescription.substring(0, 60);
    const category =
      categoryRes.choices[0]?.message?.content?.trim() || 'Other';

    await PatternCache.create({ rawPattern: normalizedKey, plainLanguage, category });

    return { plainLanguage, category };
  } catch (err) {
    logger.error(`OpenAI translation failed for: ${rawDescription.substring(0, 50)}`);
    return {
      plainLanguage: rawDescription.substring(0, 60),
      category: 'Other',
    };
  }
};

export const translateToPlainLanguage = async (rawText: string): Promise<string> => {
  const result = await translateAndCategorize(rawText);
  return result.plainLanguage;
};

export const categorizeTransaction = async (description: string): Promise<string> => {
  const result = await translateAndCategorize(description);
  return result.category;
};

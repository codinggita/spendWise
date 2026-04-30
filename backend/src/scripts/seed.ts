import mongoose from 'mongoose';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import env from '../config/env';
import logger from '../utils/logger';

const sampleTransactions = [
  { rawDescription: 'Swiggy/Order_12345', amount: 450, category: 'Food & Dining', type: 'debit', source: 'UPI', sourceName: 'PhonePe' },
  { rawDescription: 'Zomato/Dinner_Delight', amount: 850, category: 'Food & Dining', type: 'debit', source: 'UPI', sourceName: 'Google Pay' },
  { rawDescription: 'Uber/Trip_Mumbai', amount: 320, category: 'Transport', type: 'debit', source: 'CARD', sourceName: 'HDFC Bank' },
  { rawDescription: 'Amazon/Electronics_Order', amount: 12500, category: 'Shopping', type: 'debit', source: 'CARD', sourceName: 'ICICI Bank' },
  { rawDescription: 'BigBasket/Groceries', amount: 2400, category: 'Groceries', type: 'debit', source: 'UPI', sourceName: 'PhonePe' },
  { rawDescription: 'Jio/Recharge_Monthly', amount: 749, category: 'Recharge & Subscriptions', type: 'debit', source: 'UPI', sourceName: 'Google Pay' },
  { rawDescription: 'Netflix/Monthly_Subscription', amount: 499, category: 'Recharge & Subscriptions', type: 'debit', source: 'CARD', sourceName: 'HDFC Bank' },
  { rawDescription: 'Shell/Fuel_Station', amount: 3500, category: 'Fuel', type: 'debit', source: 'CARD', sourceName: 'Axis Bank' },
  { rawDescription: 'Salary/Company_Inc', amount: 125000, category: 'Income', type: 'credit', source: 'NEFT', sourceName: 'HDFC Bank' },
  { rawDescription: 'HDFC/CreditCard_Bill', amount: 15400, category: 'Utilities & Bills', type: 'debit', source: 'NETBANKING', sourceName: 'HDFC Bank' },
  { rawDescription: 'Apollo/Pharmacy_Meds', amount: 1200, category: 'Healthcare', type: 'debit', source: 'UPI', sourceName: 'PhonePe' },
  { rawDescription: 'MutualFund/SIP_Direct', amount: 10000, category: 'Investment', type: 'debit', source: 'NETBANKING', sourceName: 'ICICI Bank' },
  { rawDescription: 'Rent/April_2024', amount: 25000, category: 'Utilities & Bills', type: 'debit', source: 'NEFT', sourceName: 'HDFC Bank' },
  { rawDescription: 'Starbucks/Coffee', amount: 350, category: 'Food & Dining', type: 'debit', source: 'UPI', sourceName: 'Google Pay' },
  { rawDescription: 'Inox/Movie_Tickets', amount: 1200, category: 'Entertainment', type: 'debit', source: 'CARD', sourceName: 'Axis Bank' },
  { rawDescription: 'MakeMyTrip/Hotel_Booking', amount: 8500, category: 'Travel', type: 'debit', source: 'CARD', sourceName: 'ICICI Bank' },
  { rawDescription: 'Flipkart/Clothing', amount: 2100, category: 'Shopping', type: 'debit', source: 'UPI', sourceName: 'PhonePe' },
  { rawDescription: 'Udemy/Course_React', amount: 499, category: 'Education', type: 'debit', source: 'CARD', sourceName: 'HDFC Bank' },
  { rawDescription: 'Paytm/Wallet_Topup', amount: 2000, category: 'Transfer', type: 'debit', source: 'UPI', sourceName: 'Google Pay' },
  { rawDescription: 'Interest/Savings_Acc', amount: 450, category: 'Income', type: 'credit', source: 'OTHER', sourceName: 'HDFC Bank' },
];

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');

    // 1. Create sample user
    const userEmail = 'test@spendwise.com';
    let user = await User.findOne({ email: userEmail });
    
    if (!user) {
      user = await User.create({
        name: 'Test User',
        email: userEmail,
        password: 'Test1234', // Model will hash it
        username: 'testuser',
        isVerified: true,
        monthlyBudget: 50000,
        preferredLanguage: 'en',
      });
      logger.info('Created sample user: test@spendwise.com');
    } else {
      logger.info('Sample user already exists');
    }

    // 2. Generate 60 transactions (10 per month for last 6 months)
    const transactionsToCreate = [];
    const userId = user._id;
    const now = new Date();

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      for (let j = 0; j < 10; j++) {
        const baseTx = sampleTransactions[Math.floor(Math.random() * sampleTransactions.length)];
        const day = Math.floor(Math.random() * 28) + 1;
        const txDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        
        transactionsToCreate.push({
          ...baseTx,
          userId,
          date: txDate,
          plainLanguage: baseTx.rawDescription.replace(/\//g, ' '), // Mock AI translation
          isRecurring: false,
          tags: [baseTx.category.toLowerCase()],
        });
      }
    }

    // Clear existing transactions for this user first
    await Transaction.deleteMany({ userId });
    await Transaction.insertMany(transactionsToCreate);
    
    logger.info(`Seeded 60 transactions for user ${userEmail}`);
    process.exit(0);
  } catch (err) {
    logger.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

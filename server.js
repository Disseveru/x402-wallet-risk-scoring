import express from 'express';
import { x402Middleware } from 'x402-express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// x402 Payment Middleware
app.use(x402Middleware({
  payTo: process.env.PAY_TO_ADDRESS,
  network: process.env.NETWORK || 'base',
  // You can add price per call here if needed
  // price: '0.001' // in USDC
}));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'x402 Wallet Risk Scoring API',
    version: '1.0.0'
  });
});

// Main Risk Scoring Endpoint
app.get('/risk-score', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Missing address parameter' });
  }

  try {
    // TODO: Integrate real CDP / onchain data for wallet risk scoring
    // For now: mock response
    const riskScore = {
      address,
      score: 78, // 0-100
      riskLevel: 'medium',
      signals: {
        age_days: 245,
        tx_count: 1240,
        defi_protocols: 7,
        honeypot_risk: 'low',
        label: 'active_trader'
      },
      timestamp: new Date().toISOString()
    };

    res.json(riskScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate risk score' });
  }
});

app.listen(PORT, () => {
  console.log(`\u2705 x402 Wallet Risk API running on port ${PORT}`);
  console.log(`Pay-to address: ${process.env.PAY_TO_ADDRESS}`);
});
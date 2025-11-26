const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { supabase } = require('../supabaseClient');

const router = express.Router();

// Initialize Razorpay
// Note: Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in your .env file
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// GET /api/payments/key
router.get('/key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// POST /api/payments/create-order
router.post('/create-order', async (req, res) => {
    try {
        const { paperId, amount } = req.body;

        // Default to 150 INR if not specified
        const amountInRupees = amount || 150;

        const options = {
            amount: amountInRupees * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_paper_${paperId}`,
            notes: {
                paperId: paperId
            }
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, error: "Failed to create Razorpay order" });
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/payments/verify-payment
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            paperId
        } = req.body;

        const body = razorpayOrderId + "|" + razorpayPaymentId;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpaySignature;

        if (isAuthentic) {
            // Update payment status in Supabase
            if (paperId) {
                const { error } = await supabase
                    .from('papers')
                    .update({ payment_status: 'paid' })
                    .eq('id', paperId);

                if (error) {
                    console.error('Error updating payment status in Supabase', error);
                    return res.status(500).json({
                        success: false,
                        message: "Payment verified but failed to update paper status in database"
                    });
                }
            }

            res.json({
                success: true,
                message: "Payment verified successfully",
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature. Payment verification failed."
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

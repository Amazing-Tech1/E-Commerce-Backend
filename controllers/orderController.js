const Order = require('../models/orders')
const User = require('../models/users')
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY)



async function placeOrder(req, res) {
    const { userId, items, amount, address } = req.body
    try {
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        await Order.create(orderData)
        await User.findByIdAndUpdate(userId, { cartData: {} })
        res.status(201).json({ success: true })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
        console.log(err)
    }
}
async function placeOrderPayStack(req, res) {
    try {
        const { userId, items, amount, address } = req.body
        const { origin } = req.headers
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Paystack",
            payment: false,
            date: Date.now()
        }
        const newOrder = await Order.create(orderData)
        const currency = 'NGN'
        const delivery_fee = 150

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const customerEmail = user.email;
        const totalAmount = (amount + delivery_fee) * 100;
          const reference = `order-${newOrder._id}`;

        const session = await paystack.transaction.initialize({
            email: customerEmail,
            amount: totalAmount,
            reference: reference,
            currency: currency,
            callback_url: `${origin}/verify?success=true&orderId=${newOrder._id}&reference=${reference}`,

        });
        console.log('Paystack session response:', session);
        res.json({ success: true, session_url: session.data.authorization_url });

    } catch (err) {
        res.status(500).json({ 'message': err.message })
        console.log(err)
    }
}


async function verifyPaystack(req, res) {
    const { orderId, success, userId, reference } = req.body;

    if (!orderId || !success || !userId || !reference) {
        return res.status(400).json({ message: 'Missing required parameters: orderId, success, or userId' });
    }

    try {
        if (success === 'true') {
            console.log('successful, Verifying Payment')
            try {
                const paymentVerification = await paystack.transaction.verify(reference);
              
                if (paymentVerification.status === true) {
                    await Order.findByIdAndUpdate(orderId, { payment: true });
                    await User.findByIdAndUpdate(userId, { cartData: {} });

                    console.log(`Verification successful for order: ${orderId}`);
                    return res.status(200).json({ success: true, message: 'Payment successful' });
                } else {
                    console.log(`Payment verification failed for order: ${orderId}`);
                    await Order.findByIdAndDelete(orderId);
                    return res.status(402).json({ success: false, message: 'Payment verification failed. Please try again' });
                }
            } catch (err) {
                console.error('Error verifying payment with Paystack:', err);
                return res.status(500).json({ success: false, message: 'Error verifying payment' });
            }
        } else {
            console.log(`Payment failed for order: ${orderId}`);
            await Order.findByIdAndDelete(orderId);
            return res.status(402).json({ success: false, message: 'Payment failed. Please try again.' });
        }
    } catch (err) {
        console.error('Error processing payment:', err);
        return res.status(500).json({ message: 'An error occurred during payment processing' });
    }
}
async function placeOrderPayPal(req, res) {

}
async function allOrders(req, res) {
    const orders = await Order.find()
    if (!orders) return res.status(204)
    res.status(201).json({ success: true, orders })

}
async function userOrder(req, res) {
    const { userId } = req.body
    try {
        const orders = await Order.find({ userId })
        if (!orders) return res.status(204)
        res.status(201).json({ success: true, orders })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
        console.log(err)
    }

}
async function updateStatus(req, res) {
    try {
        const { orderId, status } = req.body
        await Order.findByIdAndUpdate(orderId, { status })
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
        console.log(err)
    }
}
module.exports = { placeOrder, placeOrderPayStack, placeOrderPayPal, verifyPaystack, allOrders, userOrder, userOrder, updateStatus }
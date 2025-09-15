import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertOrderSchema, insertServiceSchema } from "@shared/schema";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to verify Firebase token
  const verifyToken = async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      let user = await storage.getUserByFirebaseUid(decodedToken.uid);
      
      if (!user) {
        // Create user if doesn't exist
        user = await storage.createUser({
          email: decodedToken.email!,
          username: decodedToken.name || decodedToken.email!,
          firebaseUid: decodedToken.uid,
          role: 'customer',
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };

  // Auth routes
  app.get('/api/me', verifyToken, (req: any, res) => {
    res.json(req.user);
  });

  // Services routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/services', verifyToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Orders routes
  app.get('/api/orders', verifyToken, async (req: any, res) => {
    try {
      let orders;
      if (req.user.role === 'admin') {
        orders = await storage.getOrdersWithDetails();
      } else {
        orders = await storage.getOrdersWithDetails(req.user.id);
      }
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/orders', verifyToken, async (req: any, res) => {
    try {
      const orderData = {
        ...insertOrderSchema.parse(req.body),
        userId: req.user.id,
      };
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch('/api/orders/:id', verifyToken, async (req: any, res) => {
    try {
      const orderId = req.params.id;
      const updates = req.body;
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Check permissions
      if (req.user.role !== 'admin' && order.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const updatedOrder = await storage.updateOrder(orderId, updates);
      
      // Send notification if status changed
      if (updates.status && updates.status !== order.status) {
        await storage.createNotification({
          userId: order.userId,
          orderId: orderId,
          type: 'system',
          title: 'Order Status Updated',
          message: `Your order #${orderId.substring(0, 8)} status changed to ${updates.status}`,
        });
      }
      
      res.json(updatedOrder);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Payment routes
  app.post('/api/create-payment-intent', verifyToken, async (req: any, res) => {
    try {
      const { amount, orderId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId,
          userId: req.user.id,
        },
      });

      // Update order with payment intent ID
      if (orderId) {
        await storage.updateOrder(orderId, {
          stripePaymentIntentId: paymentIntent.id,
        });
      }

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating payment intent: ' + error.message });
    }
  });

  // Stripe webhook for payment status updates
  app.post('/api/webhooks/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;
      
      if (orderId) {
        await storage.updateOrder(orderId, {
          paymentStatus: 'paid',
          status: 'confirmed',
        });
      }
    }

    res.json({ received: true });
  });

  // Analytics routes (admin only)
  app.get('/api/analytics/stats', verifyToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const stats = await storage.getOrderStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/analytics/revenue', verifyToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const analytics = await storage.getRevenueAnalytics();
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Notifications
  app.get('/api/notifications', verifyToken, async (req: any, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user.id);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

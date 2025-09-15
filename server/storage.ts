import { 
  users, orders, services, notifications,
  type User, type InsertUser, 
  type Order, type InsertOrder,
  type Service, type InsertService,
  type Notification, type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserStripeInfo(id: string, stripeInfo: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<Service>): Promise<Service>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrdersWithDetails(userId?: string): Promise<any[]>;
  getAllOrders(): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;

  // Analytics
  getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    revenue: number;
    activeCustomers: number;
  }>;
  getRevenueAnalytics(): Promise<{
    dailyAverage: number;
    weeklyTotal: number;
    monthlyTotal: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserStripeInfo(id: string, stripeInfo: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User> {
    const [user] = await db.update(users).set(stripeInfo).where(eq(users.id, id)).returning();
    return user;
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true)).orderBy(services.name);
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const [service] = await db.update(services).set(updates).where(eq(services.id, id)).returning();
    return service;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrdersWithDetails(userId?: string): Promise<any[]> {
    const query = db
      .select({
        order: orders,
        user: users,
        service: services,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .innerJoin(services, eq(orders.serviceId, services.id))
      .orderBy(desc(orders.createdAt));

    if (userId) {
      return await query.where(eq(orders.userId, userId));
    }
    return await query;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder as any).returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const [order] = await db.update(orders).set({
      ...updates,
      updatedAt: new Date(),
    }).where(eq(orders.id, id)).returning();
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [order] = await db.update(orders).set({
      status,
      updatedAt: new Date(),
    }).where(eq(orders.id, id)).returning();
    return order;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    revenue: number;
    activeCustomers: number;
  }> {
    const [totalOrdersResult] = await db.select({ count: count() }).from(orders);
    const [pendingOrdersResult] = await db.select({ count: count() }).from(orders).where(eq(orders.status, 'pending'));
    const [revenueResult] = await db.select({ 
      total: sql<number>`COALESCE(SUM(${orders.total}), 0)`
    }).from(orders).where(eq(orders.paymentStatus, 'paid'));
    const [activeCustomersResult] = await db.select({ 
      count: sql<number>`COUNT(DISTINCT ${orders.userId})`
    }).from(orders).where(sql`${orders.createdAt} >= NOW() - INTERVAL '30 days'`);

    return {
      totalOrders: totalOrdersResult.count,
      pendingOrders: pendingOrdersResult.count,
      revenue: Number(revenueResult.total || 0),
      activeCustomers: Number(activeCustomersResult.count),
    };
  }

  async getRevenueAnalytics(): Promise<{
    dailyAverage: number;
    weeklyTotal: number;
    monthlyTotal: number;
  }> {
    const [dailyResult] = await db.select({ 
      total: sql<number>`COALESCE(AVG(daily_total), 0)`
    }).from(
      db.select({ 
        daily_total: sql<number>`SUM(${orders.total})`
      })
      .from(orders)
      .where(and(
        eq(orders.paymentStatus, 'paid'),
        sql`${orders.createdAt} >= NOW() - INTERVAL '30 days'`
      ))
      .groupBy(sql`DATE(${orders.createdAt})`)
      .as('daily_totals')
    );

    const [weeklyResult] = await db.select({ 
      total: sql<number>`COALESCE(SUM(${orders.total}), 0)`
    }).from(orders).where(and(
      eq(orders.paymentStatus, 'paid'),
      sql`${orders.createdAt} >= NOW() - INTERVAL '7 days'`
    ));

    const [monthlyResult] = await db.select({ 
      total: sql<number>`COALESCE(SUM(${orders.total}), 0)`
    }).from(orders).where(and(
      eq(orders.paymentStatus, 'paid'),
      sql`${orders.createdAt} >= NOW() - INTERVAL '30 days'`
    ));

    return {
      dailyAverage: Number(dailyResult.total || 0),
      weeklyTotal: Number(weeklyResult.total || 0),
      monthlyTotal: Number(monthlyResult.total || 0),
    };
  }
}

export const storage = new DatabaseStorage();

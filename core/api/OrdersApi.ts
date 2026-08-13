import { APIRequestContext } from '@playwright/test';

const API_BASE = 'https://testing.platformforge.dev/api';

export interface SeedOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  emoji?: string;
}

export interface SeedOrderData {
  items: SeedOrderItem[];
  recipientName: string;
  recipientPhone: string;
  address: string;
  paymentMethod: 'cash' | 'card';
  totalPrice: number;
}

export interface SeededOrder {
  id: string;
  _id: string;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  _id: string;
  name: string;
  price: number;
  emoji: string;
  [key: string]: unknown;
}

export class OrdersApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token: string
  ) {}

  static async login(
    request: APIRequestContext,
    username: string,
    password: string
  ): Promise<{ token: string }> {
    const res = await request.post(`${API_BASE}/auth/login`, {
      data: { username, password },
    });
    if (!res.ok()) {
      throw new Error(
        `[OrdersApi] Login failed: ${res.status()} ${await res.text()}`
      );
    }
    return res.json();
  }

  static async register(
    request: APIRequestContext,
    data: { username: string; password: string; name: string }
  ): Promise<{ token: string }> {
    const res = await request.post(`${API_BASE}/auth/register`, {
      multipart: data,
    });
    if (!res.ok()) {
      throw new Error(
        `[OrdersApi] Register failed: ${res.status()} ${await res.text()}`
      );
    }
    return res.json();
  }

  async getProducts(): Promise<Product[]> {
    const res = await this.request.get(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    if (!res.ok()) {
      throw new Error(
        `[OrdersApi] Get products failed: ${res.status()} ${await res.text()}`
      );
    }
    return res.json();
  }

  async createOrder(order: SeedOrderData): Promise<SeededOrder> {
    const res = await this.request.post(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: order,
    });
    if (!res.ok()) {
      throw new Error(
        `[OrdersApi] Create order failed: ${res.status()} ${await res.text()}`
      );
    }
    return res.json();
  }

  async deleteOrder(id: string): Promise<void> {
    const res = await this.request.delete(`${API_BASE}/orders/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    if (!res.ok()) {
      throw new Error(
        `[OrdersApi] Delete order failed: ${res.status()} ${await res.text()}`
      );
    }
  }
}

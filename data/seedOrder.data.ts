export interface SeedOrderTestData {
  recipientPhone: string;
  address: string;
  // Must match the /orders API's actual enum ("cash" | "card") — not the
  // Checkout UI's "cod" button label, which is a different concept.
  paymentMethod: 'cash' | 'card';
}

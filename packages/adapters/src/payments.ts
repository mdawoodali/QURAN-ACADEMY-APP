export interface PaymentProvider {
  createCheckout(amountMinor: number, currency: string, successUrl: string, cancelUrl: string, metadata?: Record<string, string>): Promise<{ url: string, id: string }>;
  refund(paymentId: string, amountMinor?: number, reason?: string): Promise<{ success: boolean }>;
}

export class SandboxPaymentAdapter implements PaymentProvider {
  async createCheckout(amountMinor: number, currency: string, successUrl: string, cancelUrl: string, metadata?: Record<string, string>) {
    console.log(`[Sandbox Payment] Creating checkout for ${amountMinor} ${currency}`);
    // Simulate a successful checkout creation
    const id = `chk_sandbox_${Date.now()}`;
    return { url: `${successUrl}?session_id=${id}`, id };
  }

  async refund(paymentId: string, amountMinor?: number, reason?: string) {
    console.log(`[Sandbox Payment] Refunding ${paymentId}`);
    return { success: true };
  }
}

export class StripePaymentAdapter implements PaymentProvider {
  async createCheckout(amountMinor: number, currency: string, successUrl: string, cancelUrl: string, metadata?: Record<string, string>) {
    // Stub for real Stripe implementation
    throw new Error('Stripe not yet configured with secret key');
  }

  async refund(paymentId: string, amountMinor?: number, reason?: string) {
    throw new Error('Stripe not yet configured');
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.NODE_ENV === 'development' || !process.env.STRIPE_SECRET_KEY) {
    return new SandboxPaymentAdapter();
  }
  return new StripePaymentAdapter();
}

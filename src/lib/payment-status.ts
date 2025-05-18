// payment-status.ts
// Utility for fetching payment status by chargeId

export type PaymentStatus = 'success' | 'processing' | 'error' | 'pending' | 'confirmed' | 'completed';

export async function fetchPaymentStatus(chargeId: string): Promise<PaymentStatus> {
  try {
    const res = await fetch(`/api/chargeStatus?chargeId=${chargeId}`);
    
    // Check if the response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await res.text();
      console.error('Non-JSON response from server:', errorText.substring(0, 200));
      return 'pending';
    }

    const data = await res.json();
    
    if (!data || typeof data !== 'object') {
      console.error('Invalid response format from charge status API');
      return 'pending';
    }
    
    if (!data.statusName) {
      console.error('Missing statusName in response:', data);
      return 'pending';
    }
    
    const status = String(data.statusName).toLowerCase();
    
    if (['confirmed', 'completed', 'resolved', 'paid', 'success'].includes(status)) {
      return 'success';
    }
    if (status.includes('error') || status.includes('fail')) {
      return 'error';
    }
    if (status === 'processing' || status === 'pending') {
      return 'processing';
    }
    
    return 'pending';
    
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return 'pending';
  }
}

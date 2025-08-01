import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { userEmail, userId } = await request.json();
    
    if (!userEmail || !userId) {
      return NextResponse.json({ error: 'Missing user data' }, { status: 400 });
    }

    // Crear sesión de checkout de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Fidbaq Pro Plan',
              description: 'Unlimited boards and premium features',
            },
            unit_amount: 1900, // $19.00 en centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Pago único
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard?upgrade=cancelled`,
      metadata: {
        user_id: userId,
        user_email: userEmail,
        plan: 'pro',
      },
      customer_email: userEmail,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
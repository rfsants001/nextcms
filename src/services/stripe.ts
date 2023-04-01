import Stripe from 'stripe';
import { version } from '../../package.json'

const stripeKey = process.env.STRIPE_API_KEY

export const stripe = new Stripe(
    stripeKey!,
    {
        apiVersion: '2022-11-15',
        appInfo: {
            name: "Nextcms",
            version
        }
    }
)
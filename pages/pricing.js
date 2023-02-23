import Link from 'next/link'
import Stripe from 'stripe'
import {processSubscription} from 'utils/payment'
import {useUser} from '@auth0/mextjs-auth0'

const Pricing = ({ plans }) => {
  const { user } = useUser()

  return (
    <div>
      {plans.map((plan) => (
        <div key={plan.id}>
          <h2>{plan.name}</h2>
          <p>
            <span>${plan.price / 100}
              <span>{plan.currency}</span>
            </span>
            <span>{plan.interval}ly</span>
          </p>
          {user ? (
            <button onClick={() => processSubscription(plan.id)}>
              Subscribe!
            </button>
          ) : (
            <Link href='/api/auth/login'>
              <a>Create Account</a>
            </Link>
          )}
        </div>
      ))}
    </div>
  )
};

export const getStaticProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { data: prices } = await stripe.prices.list()
  const plans = await Promise.all(
    prices.map(async (price) => {
    const product = await stripe.products.retrieve(price.product)
    return {
      id: price.id,
      name: product.name,
      price: price.unit_amount,
      interval: price.recurring.interval,
      currency: price.currency,
    }
    })
  )

  return {
    props: {
      plans: plans.reverse(),
    },
  }
}

export default Pricing
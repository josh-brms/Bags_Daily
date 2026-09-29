import { Link } from 'react-router-dom'
import LegalPage from '@/components/layout/LegalPage'
import { CONTACT_EMAIL, INSTAGRAM_URL } from '@/data/site'

export default function Refund() {
  return (
    <LegalPage title="Refund Policy">
      <h2>1. How buying works here</h2>
      <p>
        This website is a <strong>product browser, not a shop</strong>. There is no checkout,
        no cart, and no payment is taken here. Every product link opens on Instagram, and
        any purchase is arranged privately by message with us.
      </p>
      <p>
        Because of that, this policy applies to items you have arranged with us directly —
        it is not a separate online returns process.
      </p>

      <h2>2. Your rights</h2>
      <p>
        Under the Philippine Consumer Act (RA 7394), you may return defective, damaged, or
        wrongly described goods. Nothing in this policy limits those rights.
      </p>

      <h2>3. Return window</h2>
      <p>
        You may request a return within <strong>7 days</strong> of receiving your piece.
        Please inspect it as soon as it arrives.
      </p>

      <h2>4. Condition of returned items</h2>
      <ul>
        <li>Items should be unworn and unwashed, with tags still attached — unless the item is defective.</li>
        <li>Defective or wrongly described items can be returned in the condition they arrived.</li>
      </ul>

      <h2>5. How to request a return</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with your order
        details, a short description of the issue, and photos if the item is damaged or
        defective. We will reply with the next steps, including where to send it. You can
        also reach us on{' '}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        , though email is faster for paperwork.
      </p>

      <h2>6. Remedies</h2>
      <p>
        Depending on the situation, we offer a replacement, an exchange, or a refund of the
        amount you paid. If a refund is due, it is returned through the payment channel
        used for the original purchase, which we will confirm with you first.
      </p>

      <h2>7. Change of mind</h2>
      <p>
        For non-defective change-of-mind returns, we offer an exchange or store credit
        where stock allows. Original delivery fees are not refundable in this case.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about a return? Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will help. See also
        our <Link to="/terms">terms and conditions</Link>.
      </p>
    </LegalPage>
  )
}

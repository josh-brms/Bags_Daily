import { Link } from 'react-router-dom'
import LegalPage from '@/components/layout/LegalPage'
import { CONTACT_EMAIL, BRAND_NAME, LEGAL_ENTITY, LOCATION } from '@/data/site'

export default function Terms() {
  return (
    <LegalPage title="Terms and Conditions">
      <h2>1. About these terms</h2>
      <p>
        These terms govern your use of this website, operated by {LEGAL_ENTITY} in
        {LOCATION}, Philippines, trading as {BRAND_NAME}, consistent with the Philippine
        E-commerce Act (RA 8792) and the Consumer Act (RA 7394). By using the site, you
        agree to them.
      </p>

      <h2>2. What this site is</h2>
      <p>
        This website is a <strong>product browser</strong>. It shows photographs and
        descriptions of pieces from the collection and links out to Instagram. It does not
        take orders, take payment, or hold a cart, and clicking a product takes you off this
        site entirely.
      </p>

      <h2>3. Products, images, and pricing</h2>
      <p>
        We describe every piece as accurately as we can. Colours may look slightly
        different depending on your screen and settings, and minor variations between
        pieces are normal for a small studio. Photographs may be edited for lighting and
        colour, and are not a substitute for handling the piece.
      </p>
      <p>
        We do not publish prices on this site. Current pricing, availability, and colourways
        are given on our Instagram or by email, and are the authoritative figures.
      </p>

      <h2>4. Orders</h2>
      <p>
        No order can be placed here. To buy a piece, contact us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or message us on
        Instagram. A contract of sale is formed only when we have confirmed the piece, the
        price, delivery, and payment in writing. Nothing on this site — including a
        photograph of a piece — reserves stock or creates an obligation to sell.
      </p>

      <h2>5. Payment and delivery</h2>
      <p>
        Payment and delivery are arranged privately when you enquire. We will always
        confirm the total cost, including any delivery fees, before you pay. We are not a
        payment service and do not handle card details through this website.
      </p>

      <h2>6. Returns</h2>
      <p>
        Our returns process is described in the <Link to="/refund">Refund policy</Link>,
        which forms part of these terms.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The {BRAND_NAME} name and logo, and the {LEGAL_ENTITY} name, photographs, and
        text on this site, belong to {LEGAL_ENTITY}. Please do not copy or reuse them without written
        permission. Product photography of pieces belonging to other people or brands
        remains the property of its owner.
      </p>

      <h2>8. Third-party links</h2>
      <p>
        This site links to Instagram and to external fonts. We do not control those
        services and are not responsible for their content, availability, or privacy
        practices. Following an external link takes you to a site governed by different
        terms.
      </p>

      <h2>9. Liability</h2>
      <p>
        We work to keep this site accurate and available, but it is provided &quot;as is&quot;
        and may change without notice. To the extent allowed by law, we are not liable for
        losses arising from use of this site. Nothing here limits your rights under
        RA 7394 or excludes liability that cannot lawfully be excluded.
      </p>

      <h2>10. Governing law</h2>
      <p>These terms are governed by the laws of the Republic of the Philippines.</p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms? Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}

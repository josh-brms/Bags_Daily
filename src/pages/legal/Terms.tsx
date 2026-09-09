import { Link } from 'react-router-dom'
import LegalPage from '@/components/layout/LegalPage'

export default function Terms() {
  return (
    <LegalPage title="Terms and Conditions">
      <h2>1. About these terms</h2>
      <p>
        These terms govern your use of this website, operated by CY Studio, Naga City, Camarines
        Sur, Philippines, consistent with the Philippine E-commerce Act (RA 8792). By using the
        site, you agree to them.
      </p>

      <h2>2. Products and pricing</h2>
      <p>
        All prices are in Philippine pesos (PHP). We describe every piece as accurately as we can;
        however, colours may look slightly different depending on your screen, and minor variations
        between pieces are normal for a small studio.
      </p>

      <h2>3. Orders</h2>
      <p>
        This website is currently a showcase. To order, contact us at{' '}
        <a href="mailto:hello@cy.studio">hello@cy.studio</a>. A sale is formed only when we confirm
        your order and payment — adding an item to your bag on this site does not place an order or
        reserve stock.
      </p>

      <h2>4. Payment and delivery</h2>
      <p>
        Payment and delivery options are arranged by email when you order. We will always confirm
        the total cost, including any delivery fees, before you pay.
      </p>

      <h2>5. Returns</h2>
      <p>
        Our returns and refunds process is described in the{' '}
        <Link to="/refund">Refund policy</Link>, which forms part of these terms.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The CY Studio name, logo, photographs, and text on this site belong to CY Studio. Please do
        not copy or reuse them without written permission.
      </p>

      <h2>7. Liability</h2>
      <p>
        We work to keep the site accurate and available, but it is provided "as is". To the extent
        allowed by law, we are not liable for losses arising from use of the site beyond the value
        of any order you place with us.
      </p>

      <h2>8. Governing law</h2>
      <p>These terms are governed by the laws of the Republic of the Philippines.</p>

      <h2>9. Contact</h2>
      <p>
        Questions about these terms? Email <a href="mailto:hello@cy.studio">hello@cy.studio</a>.
      </p>
    </LegalPage>
  )
}

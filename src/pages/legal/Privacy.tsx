import { Link } from 'react-router-dom'
import LegalPage from '@/components/layout/LegalPage'

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <h2>1. Who we are</h2>
      <p>
        CY Studio ("we", "us", "our") is an independent studio based in Naga City, Camarines Sur,
        Philippines, operating this website to present its collection. You can reach us at{' '}
        <a href="mailto:hello@cy.studio">hello@cy.studio</a>.
      </p>

      <h2>2. Information this website collects</h2>
      <p>
        This website itself stores no personal information. It runs no analytics, no advertising, no
        tracking scripts, and no third-party services. Browsing the site does not identify you.
      </p>
      <p>
        If you contact us by email, we receive your name, email address, and the contents of your
        message. If you place an order, we also receive the details needed to fulfil it, such as
        your delivery address.
      </p>

      <h2>3. How we use information</h2>
      <ul>
        <li>To reply to your questions and messages.</li>
        <li>To process and deliver orders you initiate with us.</li>
        <li>To keep basic records required by Philippine law.</li>
      </ul>
      <p>We do not use your information for automated decision-making or profiling, and we do not sell it.</p>

      <h2>4. Sharing of information</h2>
      <p>
        We share personal information only with the parties strictly needed to complete a delivery
        (for example, a courier), or when required by law. We do not share it for marketing purposes.
      </p>

      <h2>5. Cookies and tracking</h2>
      <p>
        This website does not use cookies for tracking and loads no third-party embeds or fonts. See
        our <Link to="/cookies">Cookie policy</Link> for details.
      </p>

      <h2>6. Your rights under the Data Privacy Act (RA 10173)</h2>
      <p>
        You have the right to access your personal data, request correction or erasure, object to
        processing, and lodge a complaint with the{' '}
        <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer">
          National Privacy Commission
        </a>
        . To exercise any right, email us at <a href="mailto:hello@cy.studio">hello@cy.studio</a>.
      </p>

      <h2>7. Retention</h2>
      <p>
        We keep correspondence and order records only for as long as needed to serve you and to meet
        legal record-keeping obligations, after which they are deleted.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>If we update this policy, the revised version will be posted on this page with a new "last updated" date.</p>
    </LegalPage>
  )
}

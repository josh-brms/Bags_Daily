import { Link } from 'react-router-dom'
import LegalPage from '@/components/layout/LegalPage'
import { CONTACT_EMAIL, INSTAGRAM_URL, BRAND_NAME, LEGAL_ENTITY, LOCATION } from '@/data/site'

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <h2>1. Who we are</h2>
      <p>
        {LEGAL_ENTITY} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an independent studio
        based in {LOCATION}, Philippines, trading as {BRAND_NAME}, operating this
        website to present its collection. You can reach us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>2. What this website collects</h2>
      <p>
        This website itself stores no personal information. It runs no advertising, no
        tracking pixels, and sets no cookies. Browsing the site does not create an
        identifier for you, and nothing is kept on your device between visits.
      </p>
      <p>
        Two limited exceptions, both explained in full in our{' '}
        <Link to="/cookies">cookie policy</Link>:
      </p>
      <ul>
        <li>
          <strong>Web fonts.</strong> The page requests its fonts from Google Fonts, so
          Google sees the IP address and browser details attached to that one request.
          Nothing about you is sent to us.
        </li>
        <li>
          <strong>Admin sign-in.</strong> The <code>/admin</code> page holds a GitHub
          access token in session storage so the site owner can edit the catalogue. It
          never reaches us or any visitor, and it is cleared when the tab closes.
        </li>
      </ul>

      <h2>3. Information you give us</h2>
      <p>
        If you contact us by email or Instagram, we receive whatever you choose to send —
        typically your name, handle, email address, and the contents of your message. We
        use it only to reply.
      </p>
      <p>
        If you go on to buy a piece, we also keep the details needed to fulfil it, such as
        your delivery address and the amount paid. That record is held by us directly, not
        on this website.
      </p>

      <h2>4. How we use information</h2>
      <ul>
        <li>To reply to your questions and messages.</li>
        <li>To arrange, deliver, and support a piece you have bought from us.</li>
        <li>To keep basic records required by Philippine law.</li>
      </ul>
      <p>
        We do not use your information for automated decision-making or profiling, and we
        do not sell it.
      </p>

      <h2>5. Sharing of information</h2>
      <p>
        We share personal information only with the parties strictly needed to complete a
        delivery (for example, a courier), or when required by law. We do not share it for
        marketing purposes. Note that Instagram and Google operate their own services under
        their own privacy policies whenever you interact with them or they serve a file to
        your browser.
      </p>

      <h2>6. Cookies and tracking</h2>
      <p>
        This website does not use cookies for tracking. See our{' '}
        <Link to="/cookies">cookie policy</Link> for the two limited exceptions above. If
        we add page-view analytics in future, it will be cookieless, will not load until
        you accept it, and this page will be updated first.
      </p>

      <h2>7. Your rights under the Data Privacy Act (RA 10173)</h2>
      <p>
        You have the right to access your personal data, request correction or erasure,
        object to processing, and lodge a complaint with the{' '}
        <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer">
          National Privacy Commission
        </a>
        . To exercise any right, email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>8. Retention</h2>
      <p>
        We keep correspondence and order records only for as long as needed to serve you
        and to meet legal record-keeping obligations, after which they are deleted.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        If we update this policy, the revised version will be posted on this page with a
        new &quot;last updated&quot; date. You can also find us on{' '}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        .
      </p>
    </LegalPage>
  )
}

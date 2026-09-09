import { Link } from 'react-router-dom'
import LegalPage from '@/components/layout/LegalPage'

export default function Cookies() {
  return (
    <LegalPage title="Cookie Policy">
      <h2>1. Short version</h2>
      <p>
        This website does not use tracking cookies, advertising cookies, or any third-party
        tracking. That is why you are not seeing a cookie consent banner — there is nothing to
        consent to.
      </p>

      <h2>2. What the site does use</h2>
      <ul>
        <li>
          <strong>Strictly necessary browser features only.</strong> The site keeps your colour and
          size selection in memory while you browse a product page. This is temporary and cleared
          when you close the tab.
        </li>
        <li>
          <strong>No persistent storage.</strong> We do not store cookies, identifiers, or browsing
          history on your device between visits.
        </li>
      </ul>

      <h2>3. No third-party services</h2>
      <p>
        The site loads everything — text, styles, icons, and images — from this website itself.
        There are no external fonts, analytics scripts, advertising pixels, maps, videos, or social
        media embeds, so no third party receives data about your visit.
      </p>

      <h2>4. Email instead</h2>
      <p>
        The only way information leaves this site is when you choose to email us. Standard email
        privacy considerations apply — see our <Link to="/privacy">Privacy policy</Link>.
      </p>

      <h2>5. Changes</h2>
      <p>
        If we ever add cookies or third-party services, we will update this page and show a consent
        notice before anything is loaded.
      </p>
    </LegalPage>
  )
}

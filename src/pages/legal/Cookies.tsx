import { Link } from 'react-router-dom'
import LegalPage from '@/components/layout/LegalPage'

export default function Cookies() {
  return (
    <LegalPage title="Cookie Policy">
      <h2>1. Short version</h2>
      <p>
        This website sets no advertising or tracking cookies, and runs no third-party
        advertising. It does load web fonts from Google, which means Google can see the
        request our server makes for them — that is explained below. There is no
        advertising pixel, map, video, or social embed on any page.
      </p>

      <h2>2. What is stored on your device</h2>
      <ul>
        <li>
          <strong>No cookies and no local storage.</strong> Browsing this site does not
          create an identifier, and nothing is retained on your device between visits.
        </li>
        <li>
          <strong>Session storage, used only if you open the admin page.</strong> If you
          are the site owner and sign in to <code>/admin</code>, a GitHub access token is
          held in your browser&apos;s session storage. It is never written to the
          repository, never sent anywhere except GitHub&apos;s own API, and is deleted
          when you close the tab. Visitors never reach this page.
        </li>
        <li>
          <strong>Your Instagram clicks.</strong> If you follow a product link to
          Instagram, that visit is governed by Meta&apos;s privacy policy, not this one.
        </li>
      </ul>

      <h2>3. Web fonts</h2>
      <p>
        The headings and body text use the typefaces <em>Fraunces</em> and{' '}
        <em>Manrope</em>, which are requested from Google Fonts
        (<code>fonts.googleapis.com</code> and <code>fonts.gstatic.com</code>). Your
        browser&apos;s IP address and user agent are therefore visible to Google when
        those files are fetched, exactly as with any externally hosted asset. We do not
        use those fonts for advertising, profiling, or any other purpose, and Google does
        not receive anything else from us. If you would rather we did not send anything
        to Google at all, contact us and we will self-host the font files instead.
      </p>

      <h2>4. What leaves this site</h2>
      <p>
        Apart from the font request above, the only way information leaves this site is
        when you choose to email us. Standard email privacy considerations apply — see our{' '}
        <Link to="/privacy">Privacy policy</Link>.
      </p>

      <h2>5. Analytics</h2>
      <p>
        We may add privacy-friendly, cookieless page-view analytics in future. If we do,
        this page will name the provider and exactly what it collects, the script will not
        load at all until you accept it, and you will be asked before anything is
        recorded.
      </p>

      <h2>6. Changes</h2>
      <p>
        If we ever add cookies or third-party services, we will update this page and show
        a consent notice before anything is loaded.
      </p>
    </LegalPage>
  )
}

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function Localise() {
  const { locale, locales } = useRouter();
  const { t: translate } = useTranslation('home');

  return (
    <div>
      <h2>Internationalization</h2>
      <p>{translate('greeting')}</p>
      <p>
        Current locale is <code>{locale}</code>.
      </p>
      <div>
        Available locales are:
        {locales.map((loc) => (
          <Link href="/" locale={loc}>
            <li key={loc}> {loc.toLowerCase()} </li>
          </Link>
        ))}
      </div>
    </div>
  );
}

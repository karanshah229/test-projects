import { HRAnchor, HRButton, HRStack } from '@hackerrank/hrds-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

export function PageNotFound() {
  const router = useRouter();
  return (
    <HRStack direction="vertical" spacing={16}>
      <h1>404</h1>

      <h5>
        We could not find the page you were looking for, so we found something to make you laugh to
        make up for it.
      </h5>

      <HRButton variant="primary" onClick={() => router.back()}>
        Go back a page
      </HRButton>

      <div>
        <Image
          src="https://hrcdn.net/hackerrank/assets/fourohfour.png"
          alt="xkcd comic about Python: I wrote 20 short programs in Python yesterday. It was wonderful. Perl, I'm leaving you."
          width="518"
          height="588"
        />

        <p>
          credit{' '}
          <HRAnchor href="https://xkcd.com/license.html" target="_blank">
            xkcd
          </HRAnchor>
        </p>
      </div>
    </HRStack>
  );
}

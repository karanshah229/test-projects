import { HRAnchor } from '@hackerrank/hrds-components';

import HomeStyles from './Home.module.scss';

function Home() {
  const technologies = {
    Framework: {
      name: 'Next.js',
      link: 'https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2494595232/Frontend+Architecture+Framework#Next.js',
    },
    'State Management': {
      name: 'Redux Toolkit',
      link: 'https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506129568',
    },
    'API Layer': {
      name: 'Redux Toolkit query',
      link: 'https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506391596/API+Layer#API-Libraries',
    },
    Styling: {
      name: 'SCSS Modules',
    },
    Testing: {
      name: 'React Testing Library',
      link: 'https://hackerrank.atlassian.net/wiki/spaces/FRON/pages/2190114885',
    },
    'APM + Error Handling': {
      name: 'New Relic',
      link: 'https://hackerrank.atlassian.net/wiki/spaces/FRON/pages/2497151128?atlOrigin=eyJpIjoiMTNkYzE0MjlmNDhlNDMzYWIyZWE5MjE4OWY4YWQ2YTUiLCJwIjoiY29uZmx1ZW5jZS1jaGF0cy1pbnQifQ',
    },
    'User Observability': {
      name: 'Fullstory',
    },
    Analytics: {
      name: 'GTag v/s Fullstory (TBD)',
    },
    Forms: {
      name: 'react-hook-form',
      link: 'react-hook-form',
    },
    'DateTime library': {
      name: 'date-fns',
      link: 'https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506817853',
    },
  };

  return (
    <>
      <HRAnchor
        href="https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506522633/Frontend+Architecture"
        variant="large"
        underline="always"
      >
        <h2 className={HomeStyles.h3}>Hackerrank Frontend Starter Repo Technologies:</h2>
      </HRAnchor>
      <ul>
        {Object.keys(technologies).map((tech, idx) => (
          <li key={idx}>
            {tech} -{' '}
            {technologies[tech]?.link ? (
              <HRAnchor href={technologies[tech]?.link} variant="large" underline="always">
                {technologies[tech].name}
              </HRAnchor>
            ) : (
              technologies[tech].name
            )}
          </li>
        ))}
      </ul>

      <HRAnchor
        href="https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506522633/Frontend+Architecture"
        variant="large"
        underline="always"
      >
        Confluence pages for technology decisions made
      </HRAnchor>
    </>
  );
}

export default Home;

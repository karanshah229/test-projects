# Nextjs Starter Code

Boilerplate for applications using Next.js as their React framework.

This app includes:

1. Framework - [Next.js](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2494595232/Frontend+Architecture+Findings#Next.js)
2. HRDS
3. State Management - [Redux Toolkit](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506129568)
4. API Layer - [Redux Toolkit query](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506391596/API+Layer#API-Libraries)
5. Testing - [React Testing Library](https://hackerrank.atlassian.net/wiki/spaces/FRON/pages/2190114885)
6. Performance Monitoring - [New Relic](https://hackerrank.atlassian.net/wiki/spaces/FRON/pages/2497151128?atlOrigin=eyJpIjoiMTNkYzE0MjlmNDhlNDMzYWIyZWE5MjE4OWY4YWQ2YTUiLCJwIjoiY29uZmx1ZW5jZS1jaGF0cy1pbnQifQ)
7. i18n - Using `next-i18next`

Additional Technologies that have been decided upon:

1. Forms - [react-hook-form](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2515009794)
2. DateTime library - [date-fns or date.js](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506817853)
3. Error Tracking - NewRelic
4. User Observability - Fullstory
5. Analytics - GTag v/s Fullstory (TBD)

##### Contributing

1. Clone the repo
2. Run `yarn install` and start developing and open a PR

##### Commands:

1. Run project in development mode

   ```bash
   yarn dev
   ```

2. Build project

   ```bash
   yarn build
   ```

3. Run tests

   ```bash
   yarn test
   ```

4. Run project in production mode

   ```bash
   yarn build
   ```

   ```bash
   yarn start
   ```

   > Note: `start` requires `build` to have been run before

[For more commands check Next.js CLI docs](https://nextjs.org/docs/api-reference/cli)

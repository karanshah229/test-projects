# SkillUp Frontend

Frontend code for SkilUp

This app includes:

1. Framework - [Next.js](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2494595232/Frontend+Architecture+Findings#Next.js)
2. HRDS
3. State Management - [Redux Toolkit](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506129568)
4. API Layer - [Redux Toolkit query](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506391596/API+Layer#API-Libraries)
5. Testing - [React Testing Library](https://hackerrank.atlassian.net/wiki/spaces/FRON/pages/2190114885)
6. Performance Monitoring - [New Relic](https://hackerrank.atlassian.net/wiki/spaces/FRON/pages/2497151128?atlOrigin=eyJpIjoiMTNkYzE0MjlmNDhlNDMzYWIyZWE5MjE4OWY4YWQ2YTUiLCJwIjoiY29uZmx1ZW5jZS1jaGF0cy1pbnQifQ)
7. i18n - Using `next-i18next`
8. DateTime library - [day.js](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2506817853)
9. APM + Error Tracking - New Relic
10. User Observability - Fullstory

Additional Technologies reasearched but not added:

1. Forms - [react-hook-form](https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2515009794)

### Contributing

1. Clone the repo
2. Run `yarn install` and start developing and open a PR

### Dev Workflow:

1. Deploy Private node
2. Start devspace proxy
   ```bash
   devspace start:proxy ${nodename}
   ```
3. Run project in development mode

   ```bash
   yarn dev
   ```

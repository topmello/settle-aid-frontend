# Settle-Aid-Frontend

Frontend project for SettleAid  

👉 [Frontend Dev Doc](https://topmello.github.io/docs/frontend/introduction)

## User Manual

### Test Run The App

Run the development server using

- When using iOS, scan the QR code with camera app
- When using Android, scan the QR code with Expo Go App

```bash
npm start
```

and then scan the QR code in the terminal (you may need to scroll up to see them)

## Development Overview

### Tech Stack

Frontend Tech stack we use:

- [React Native](https://reactnative.dev/) - Fundamental Framework to build native app for Android and iOS in React
- [React Native Paper](https://reactnativepaper.com/) - UI component and theme library for UI consistency accross devices
- [React Native Dates](https://web-ridge.github.io/react-native-paper-dates/docs/intro) - Date selector component for React Native Paper
- [Expo Router](https://docs.expo.dev/routing/introduction/) - Routing between screens
- [Axios](https://axios-http.com/docs/intro) - API request library
- [Redux](https://redux.js.org/) - Global state management for React app
- [Redux Persist](https://github.com/rt2zz/redux-persist) - Data persistance for Redux
- [React i18next](https://react.i18next.com/) - Internalization for React
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) - Providing access to Geolocation
- [React Native Maps](https://www.npmjs.com/package/react-native-maps?activeTab=readme) - Cross-platform map component

🆕 New In Iteration 2
- [Expo Calendar](https://docs.expo.dev/versions/latest/sdk/calendar/) - Provides an API for interacting with the device's system calendars
- [Expo KeepAwake](https://docs.expo.dev/versions/latest/sdk/keep-awake/) - A React component that prevents the screen from sleeping when rendered.
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/) - A library that provides an interface for native user localization information.
- [Expo Print](https://docs.expo.dev/versions/latest/sdk/print/) - A library that provides printing functionality for Android and iOS (AirPrint).
- [React Native Share](https://reactnative.dev/docs/share) - Provide access to system share API
- [Socket.io Client](https://www.npmjs.com/package/socket.io-client) - For realtime messaging

### Custom Hooks
* useAppTheme() - get a theme object that provides custom app theme colors

### Directory Descrioption

- api - fetch method wrapper for api requests
- app - router root directory, all pages sits here
- assets - static assets like images and fonts
- components - components that could be used across pages
- hooks - custom hooks
- store - UI data store, all ui data resides here, based on Redux
- theme - ui theme related code
- translation - translation files
- types - object type that could be used accross pages
- constants - const that might be used accross pages

### Additional Resources

### Deployment

- Official Doc: https://docs.expo.dev/build-reference/apk/

#### Login:

```bash
expo login
```
> If console throw "verify that the path is correct and try again" when using the commands, add "npx" before each command except "npm" one would help.  
#### Install EAS Cli:

```bash
npm install --global eas-cli
```
#### Link the code base to project:

```bash
eas init --id 714abc65-7237-4be7-8349-feffeae9f93d
```
#### Build:

```bash
eas build -p android --profile preview
```

#### Icons

- [Material Design Icons](https://pictogrammers.com/library/mdi/) - Material Community Icons Search Engine, could be used to find the names of certain icon
- [React Native Paper Icons Page](https://callstack.github.io/react-native-paper/docs/guides/icons)

#### Routers

- [Expo Router - Create Page](https://docs.expo.dev/routing/create-pages/) - Create page manual of Expo Router
- [Expo Router - Navigate between pages](https://docs.expo.dev/routing/navigating-pages/) - How to navigate between pages both component and imperative

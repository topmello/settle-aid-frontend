# Settle-Aid-Frontend

Frontend project for SettleAid

## User Manual

### Test Run The App

Run the development server using

- When using iOS, scan the QR code with camera app
- When using Android, scan the QR code with Expo Go App

```bash
npm start
```

and then scan the QR code in the terminal (you may need to scroll up to see them)

## Development Manual

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

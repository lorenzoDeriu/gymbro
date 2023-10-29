# GymBro

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

### Env

In the "environment" folder, you need to add the "environment.ts" and "environment.development.ts" files in order to run with a Firebase configuration. The file should look like this:

```
export const environment = {
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

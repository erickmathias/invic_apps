// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  production: false,
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  authUrl: 'http://localhost:8083/auth',
  bbsUrl: 'http://localhost:8083/bbs',
  slabUrl: 'http://localhost:8083/slab',
  baseUrl: 'http://localhost:8083',
  reportsBaseUrl: 'https://invic.co.tz/bbs/api'
  // reportsBaseUrl: 'http://localhost:8081/bbs/bbs/api'
};

/*export const environment = {
  production: true,
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  authUrl: 'https://invic.co.tz:8082/auth',
  bbsUrl: 'https://invic.co.tz:8082/bbs',
  baseUrl: 'https://invic.co.tz:8082',
  reportsBaseUrl: 'https://invic.co.tz/bbs/bbs/api'
};*/

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

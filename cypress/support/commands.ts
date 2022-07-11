/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Import the functions you need from the SDKs you need

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { attachCustomCommands } from 'cypress-firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB2DGHWbuVLvZwlF_D5wKJ7X5KEdrG5khs',
  authDomain: 'simple-chat-app-71631.firebaseapp.com',
  projectId: 'simple-chat-app-71631',
  storageBucket: 'simple-chat-app-71631.appspot.com',
  messagingSenderId: '532022753727',
  appId: '1:532022753727:web:41412ed2f3c25144ef490a',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

attachCustomCommands({ Cypress, cy, firebase });

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { id_token } = body;
    cy.request('POST', '/api/login', { jwt: id_token }).then(
      ({ body: { accessToken } }) => {
        cy.setCookie('trello_token', accessToken);
      }
    );
  });
});

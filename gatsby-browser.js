/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

import "./src/styles/tailwind.css"

import CartContextProvider from './src/context/CartContext';

// this wraps the app in the Provider

export const wrapRootElement = CartContextProvider;
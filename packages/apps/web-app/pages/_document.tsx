import * as React from 'react';
import Document, { NextDocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { AppRegistry } from 'react-native-web';

export default class MyDocument extends Document {
  public static async getInitialProps(ctx: NextDocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: App => (props) => {
          // TODO: this could possible pass the app returned from AppRegistry.registerComponent
          //       as the App in sheet.collectStyles
          AppRegistry.registerComponent('App', () => App);
          return sheet.collectStyles(<App {...props} />);
        },
      });

      const initialProps = await Document.getInitialProps(ctx);

      const { getStyleElement } = AppRegistry.getApplication('App', { initialProps });

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            {getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}

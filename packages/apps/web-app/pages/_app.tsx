import React from 'react';
import App, { Container } from 'next/app';
import { sanitize } from 'styled-sanitize';
import { createGlobalStyle } from 'styled-components';
import { Header } from '@chatapp/react-layout';

const BaseStyles = createGlobalStyle`
  ${sanitize}
`;

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <BaseStyles />
        <Container>
          <Header/>
          <Component {...pageProps} />
        </Container>
      </>
    );
  }
}

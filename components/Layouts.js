import React from "react";
import Header from "./Header";
import { Container } from "semantic-ui-react";
import Head from "next/head";

export default props => {
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"
        />
      </Head>
      <Container>
        <Header />
        {props.children}
      </Container>
    </div>
  );
};

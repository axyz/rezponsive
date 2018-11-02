import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import Rezponsive, { RezponsiveContext, RezponsiveConsumer } from 'rezponsive';

const ContextConsumerExample = Rezponsive(({ currentMedia, isTouch }) => {
  console.log('render');
  return (
    <RezponsiveContext.Consumer>
      {({ currentMedia, isTouch }) => (
        <div>{JSON.stringify({ currentMedia, isTouch })}</div>
      )}
    </RezponsiveContext.Consumer>
  );
});

const RezponsiveApp = Rezponsive(({ children }) => <div>{children}</div>);
const WithConsumer = ({ currentMedia, isTouch }) => (
  <div>{JSON.stringify({ currentMedia, isTouch })}</div>
);

const ConsumerExample = RezponsiveConsumer(WithConsumer);

const PropsExample = Rezponsive(({ currentMedia, isTouch }) => (
  <div>{JSON.stringify({ currentMedia, isTouch })}</div>
));

render(
  <div>
    <ContextConsumerExample
      mq={{
        s: 320,
        m: 720,
        l: 1024,
        xl: Infinity,
        portrait: '(orientation: portrait)',
        landscape: '(orientation: landscape)',
      }}
      clientMedia={{
        s: false,
        m: true,
        l: false,
        xl: false,
        portrait: true,
        landscape: false,
      }}
    />
    <PropsExample
      mq={{
        s: 320,
        m: 720,
        l: 1024,
        xl: Infinity,
        portrait: '(orientation: portrait)',
        landscape: '(orientation: landscape)',
      }}
      clientMedia={{
        s: false,
        m: true,
        l: false,
        xl: false,
        portrait: true,
        landscape: false,
      }}
    />

    <RezponsiveApp
      mq={{
        s: 320,
        m: 720,
        l: 1024,
        xl: Infinity,
        portrait: '(orientation: portrait)',
        landscape: '(orientation: landscape)',
      }}
      clientMedia={{
        s: false,
        m: true,
        l: false,
        xl: false,
        portrait: true,
        landscape: false,
      }}
    >
      <ConsumerExample
        mq={{
          s: 320,
          m: 720,
          l: 1024,
          xl: Infinity,
          portrait: '(orientation: portrait)',
          landscape: '(orientation: landscape)',
        }}
      />
    </RezponsiveApp>
    <RezponsiveApp
      mq={{
        s: 320,
        m: 720,
        l: 1024,
        xl: Infinity,
        portrait: '(orientation: portrait)',
        landscape: '(orientation: landscape)',
      }}
      clientMedia={{
        s: false,
        m: true,
        l: false,
        xl: false,
        portrait: true,
        landscape: false,
      }}
      disableListeners
    >
      <ConsumerExample
        mq={{
          s: 320,
          m: 720,
          l: 1024,
          xl: Infinity,
          portrait: '(orientation: portrait)',
          landscape: '(orientation: landscape)',
        }}
      />
    </RezponsiveApp>
  </div>,
  document.getElementById('rezponsive-example'),
);

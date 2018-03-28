import React, {PropTypes} from 'react';
import {render} from 'react-dom';
import Rezponsive from 'rezponsive';


const Example = Rezponsive(({
    currentMedia,
    isTouch
}) => {
    console.log('render');
    return <div>{JSON.stringify({currentMedia, isTouch})}</div>;
});

const ReadContext = (props, {
    currentMedia,
    isTouch
}) => <div>{JSON.stringify({currentMedia, isTouch})}</div>;

ReadContext.contextTypes = {
    currentMedia: true,
    isTouch: true
};

const ContextExample = Rezponsive(ReadContext);

render(
    <div>
        <Example
            mq={{
                s: 320,
                m: 720,
                l: 1024,
                xl: Infinity,
                portrait: '(orientation: portrait)',
                landscape: '(orientation: landscape)'
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
        <ContextExample
            mq={{
                s: 320,
                m: 720,
                l: 1024,
                xl: Infinity,
                portrait: '(orientation: portrait)',
                landscape: '(orientation: landscape)'
            }}
        />
    </div>,
    document.getElementById('rezponsive-example')
);

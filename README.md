rezponsive
==========

React decorator for responsive behaviors.

When developing applications for multiple screen sizes and devices we often need
our components to know the current matched mediaquery in order to adapt its
aspect and behavior.

Rezponsive is a decorator for React components that will inject those
informations to its children props and/or context.

Usage
-----
Add `rezponsive` as a dependency

`$ npm install --save rezponsive`

then simply decorate your root container component

```javascript
import React from 'react';
import Rezponsive from 'rezponsive';

@Rezponsive // when stage-3 is available
class MyApp extends Component {
    render() {
        // currentMedia and isTouch are available here
        ...
    }
}

export default MyApp;

// or without stage-3
export default Rezponsive(MyApp);

```

`props.currentMedia` will be an object in the format:
```javascript
{
    mediaqueryName1: bool (true if matches current mediaquery),
    mediaqueryName2: bool (true if matches current mediaquery),
    ...
}
```

To define your mediaqueries you should provide an `mq` object in the formats
supported by the [mediaquery library](https://github.com/axyz/mediaquery)
```javascript
<MyApp
    mq={{
        small: 300,
        medium: 600,
        tablet: 'tablet media query',
        big: 1024,
        huge: Infinity
    }}
    isTouchOnServer // if true will treat server environment as touch devices
    serverMedia={
        small: true,
        medium: false
    } // if not defined will default to { all: true }
    clientMedia={
        small: true,
        medium: false
    } // if not defined will default null
/>
```
on isomorphic app you probably want to define a `severMedia` to choose what to
render on server side and eventually provide the isTouchOnServer property in
case you want to render as it is a touch device.

MatchMedia detection will cause an additional rendering when the component is
mounted in order to update the state accordingly to the matched queries.
For heavy components this may lead to performance issues on first loading,
to avoid that you can provide an `clientMedia` prop that will be used for the
initial rendering and the state will only change if the current mediaquery
changes. Of course however you have to be sure that `clientMedia` reflect the
current media query, otherwise your app will start with the wrong settings
and will keep them until a resize big enough to trigger matchmedia updates.

Sometimes you may want to have mediaquery informations on really deep nested
object, rezponsive will inject currentMedia and isTouch not only on props, but
also on the context of the underlying react subtree.

You can easily access the context on a child component defining the proper contextTypes
```javascript
const ReadContext = (props, context) => // use context.currentMedia or isTouch here;

ReadContext.contextTypes = {
    currentMedia: PropTypes.object,
    isTouch: PropTypes.bool
};

```

Note that you do not specify contextTypes for your component the context will be
an empty object so you will not have any overhead from rezponsive.

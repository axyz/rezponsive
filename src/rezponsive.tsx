const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

import React, { Component } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MQ = require("mediaquery");

export const RezponsiveContext = React.createContext({});

function isTouchDevice() {
  // unsupported browser such as IE11 are desktop only and will correctly
  // return false
  return window.matchMedia("(pointer: coarse)").matches;
}

const isObject = (a: any) =>
  a !== undefined && a !== null && typeof a === "object";

const isDifferent = (a: any, b: any) => {
  return Object.keys(a).some((el) => a[el] !== b[el]);
};

export default function Rezponsive(Element: any): any {
  class RezponsiveComponent extends Component {
    skipInitialCheck: any;
    state: any;
    props: any;
    static getDerivedStateFromProps(props: any, state: any) {
      if (!canUseDOM) return null;
      // short circuit for invalid clientMedia
      if (!isObject(props.clientMedia)) return null;
      // no previous clientMedia defined
      if (!isObject(state.prevClientMedia)) {
        // override the currentMedia with the newly passed clientMedia prop
        if (
          isDifferent(props.clientMedia, state.currentMedia) ||
          props.isTouch !== state.isTouch
        ) {
          return {
            prevClientMedia: props.clientMedia,
            currentMedia: props.clientMedia,
            prevIsTouch: props.isTouch,
            isTouch: props.isTouch,
          };
        } else {
          return null;
        }
      }

      const needsIsTouchUpdate =
        props.isTouch !== state.prevIsTouch && props.isTouch !== state.isTouch;
      const needsClientMediaUpdate =
        isDifferent(props.clientMedia, state.prevClientMedia) &&
        isDifferent(props.clientMedia, state.currentMedia);
      // both clientMedia and prevClientMedia are defined and valid
      if (needsClientMediaUpdate || needsIsTouchUpdate) {
        return {
          prevClientMedia: props.clientMedia,
          currentMedia: props.clientMedia,
          prevIsTouch: needsIsTouchUpdate ? props.isTouch : props.prevIsTouch,
          isTouch: needsIsTouchUpdate ? props.isTouch : isTouchDevice(),
        };
      }

      return null;
    }

    constructor(props: any) {
      super(props);

      this.updateMediaQueries = this.updateMediaQueries.bind(this);

      const mq = MQ.asArray(props.mq);

      if (canUseDOM) {
        const isTouch =
          props.isTouch !== undefined ? props.isTouch : isTouchDevice();

        const initialCurrentMedia =
          props.clientMedia ||
          mq.reduce((matches: any, q: any, index: any, mq: any) => {
            if (index === mq.length) {
              matches[q[0]] = true;
            } else {
              matches[q[0]] = false;
            }
            return matches;
          }, {});

        this.skipInitialCheck = props.clientMedia !== undefined;

        this.state = {
          prevClientMedia: props.clientMedia,
          prevIsTouch: props.isTouch,
          mm: window.matchMedia,
          mq: mq,
          isTouch: isTouch,
          currentMedia: initialCurrentMedia,
        };
      } else {
        this.state = {
          isTouch: props.isTouchOnServer,
          currentMedia: {},
        };

        this.state.currentMedia = props.serverMedia;
      }
    }

    componentDidMount() {
      if (this.props.disableListeners) return;
      this.updateMediaQueries();
      const { mm, mq } = this.state;

      Object.keys(mq).forEach((q: any) => {
        mm(mq[q]).addListener(this.updateMediaQueries);
      });
    }

    componentWillUnmount() {
      if (this.props.disableListeners) return;
      const { mm, mq } = this.state;

      Object.keys(mq).forEach((q) => {
        mm(mq[q]).removeListener(this.updateMediaQueries);
      });
    }

    updateMediaQueries() {
      const { mm, mq, currentMedia, skipInitialMatch } = this.state;

      if (this.skipInitialCheck) {
        this.skipInitialCheck = false;
        return;
      }

      const newMedia = mq.reduce((matches: any, q: any) => {
        matches[q[0]] = mm(q[1]).matches;
        return matches;
      }, {});

      const needsUpdate = Object.keys(newMedia).reduce(
        (shouldUpdate, query) => {
          return shouldUpdate || newMedia[query] !== currentMedia[query];
        },
        false
      );

      if (needsUpdate) {
        this.setState({
          currentMedia: mq.reduce((matches: any, q: any) => {
            matches[q[0]] = mm(q[1]).matches;
            return matches;
          }, {}),
        });
      }
    }

    render() {
      return (
        <RezponsiveContext.Provider
          value={{
            isTouch: this.state.isTouch,
            currentMedia: this.state.currentMedia,
          }}
        >
          <Element
            isTouch={this.state.isTouch}
            currentMedia={this.state.currentMedia}
            {...this.props}
          />
        </RezponsiveContext.Provider>
      );
    }
  }

  (RezponsiveComponent as any).propTypes = {
    mq: PropTypes.object,
    isTouchOnServer: PropTypes.bool,
    isTouch: PropTypes.bool,
    serverMedia: PropTypes.object,
    clientMedia: PropTypes.object,
    disableListeners: PropTypes.bool,
  };

  (RezponsiveComponent as any).defaultProps = {
    mq: { all: "all" },
    isTouchOnServer: false,
    serverMedia: {
      all: true,
    },
    disableListeners: false,
  };

  return RezponsiveComponent;
}

export function RezponsiveConsumer(Element: any) {
  return (props: any) => (
    <RezponsiveContext.Consumer>
      {(ctx) => <Element {...{ ...ctx, ...props }} />}
    </RezponsiveContext.Consumer>
  );
}

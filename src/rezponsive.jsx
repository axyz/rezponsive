const canUseDOM = !!(
    (typeof window !== 'undefined' &&
    window.document && window.document.createElement)
);

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MQ from 'mediaquery';

function Rezponsive(Element) {
    class RezponsiveComponent extends Component {
        constructor(props) {
            super();

            const mq = MQ.asArray(props.mq);

            if (canUseDOM) {
                const isTouch = window.Modernizr
                    ? window.Modernizr.touch
                    // inline Modernizr check
                    : (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

                const initialCurrentMedia = props.clientMedia ||
                    mq.reduce((matches, q, index, mq) => {
                        if (index === mq.length) {
                            matches[q[0]] = true;
                        } else {
                            matches[q[0]] = false;
                        }
                        return matches;
                    }, {});

                this.skipInitialCheck = !!props.clientMedia;

                this.state = {
                    mm: window.matchMedia,
                    mq: mq,
                    isTouch: isTouch,
                    currentMedia: initialCurrentMedia,
                };
            } else {
                this.state = {
                    isTouch: props.isTouchOnServer,
                    currentMedia: {}
                };

                this.state.currentMedia = props.serverMedia;
            }
        }

        getChildContext() {
            return {
                currentMedia: this.state.currentMedia,
                isTouch: this.state.isTouch
            };
        }

        componentDidMount() {
            this.updateMediaQueries();
            const { mm, mq } = this.state;

            Object.keys(mq).forEach(q => {
                mm(mq[q]).addListener(() => {
                    this.updateMediaQueries();
                });
            });
        }

        updateMediaQueries() {
            const {
                mm,
                mq,
                currentMedia,
                skipInitialMatch
            } = this.state;

            if (this.skipInitialCheck) {
                this.skipInitialCheck = false;
                return;
            }

            const newMedia = mq
                .reduce((matches, q) => {
                    matches[q[0]] = mm(q[1]).matches;
                    return matches;
                }, {});

            const needsUpdate = Object.keys(newMedia).reduce((shouldUpdate, query) => {
                return shouldUpdate || newMedia[query] !== currentMedia[query];
            }, false);

            if (needsUpdate) {
                this.setState({
                    currentMedia: mq
                        .reduce((matches, q) => {
                            matches[q[0]] = mm(q[1]).matches;
                            return matches;
                        }, {})
                });
            }
        }

        render() {
            return (
                <Element {...this.props}
                    isTouch={this.state.isTouch}
                    currentMedia={this.state.currentMedia}
                />
            );
        }
    };

    RezponsiveComponent.childContextTypes = {
        currentMedia: PropTypes.object,
        isTouch: PropTypes.bool
    };

    RezponsiveComponent.propTypes = {
        mq: PropTypes.object,
        isTouchOnServer: PropTypes.bool,
        serverMedia: PropTypes.object,
        clientMedia: PropTypes.object,
    };

    RezponsiveComponent.defaultProps = {
        mq: { all: 'all' },
        isTouchOnServer: false,
        serverMedia: {
            all: true
        },
        clientMedia: null,
    };

    return RezponsiveComponent;
}

export default Rezponsive;

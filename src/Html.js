import React, {Component, PropTypes} from 'react';
import {renderToString} from 'react-dom/server';
import serialize from 'serialize-javascript';
import versionObject from '../version.json';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
    static propTypes = {
        component: PropTypes.object,
        storeState: PropTypes.object
    }

    render() {
        const IE = {
            respond: '<!--[if lt IE 10]><script src="/assets/scripts/html5hiv.js"></script><script src="/assets/scripts/respond.min.js"></script><![endif]-->',
            shim: '<!--[if lt IE 10]><script src="/assets/scripts/es5-shim.min.js"></script><![endif]-->',
            sham: '<!--[if lt IE 10]><script src="/assets/scripts/es5-sham.min.js"></script><![endif]-->',
            placeholders: '<!--[if lt IE 10]><script src="/assets/scripts/placeholders.js"></script></script><![endif]-->'

        };
        const {component, storeState} = this.props;


        const head = `
                <title>Boilerplate</title>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width = device-width,initial-scale =1,maximum-scale=1, user-scalable=no">
                <meta name="robots" content="index,follow">
                <meta name="googlebot" content="index,follow">
                <link rel="shortcut icon" href="//images.bestday.com/_lib/images/bestday/favicon.ico" type="image/x-icon">
                <link href="/dist/main${versionObject.version}.css" media="screen, projection" rel="stylesheet" type="text/css"/>
                ${IE.respond}
                ${IE.shim}
                ${IE.sham}
                ${IE.placeholders}
        `;

        const javaScript = {
            main: `/dist/main${versionObject.version}.js`,
            vendors: `/dist/vendors${versionObject.version}.js`
        };

        return (
            <html lang="en-us">
            <head dangerouslySetInnerHTML={{__html: head}}></head>
            <body>
            <div id="content" dangerouslySetInnerHTML={{__html: renderToString(component)}}/>
            <script type="text/javascript" src="/assets/scripts/fastclick.js"></script>
            <script src={javaScript.vendors} />
            <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(storeState)};`}} />
            <script src={javaScript.main} />
            </body>
            </html>
        );
    }
}

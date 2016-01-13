import React from 'react';
import {Route} from 'react-router';
import qs from 'qs';
import {set} from 'lodash/object';
import views from '../views';

let routeElement;
let plainRoutes;

export function buildRoutes(loadedComponents = []) {
    const viewComponents = {};

    Object.keys(views).forEach(componentName => {
        viewComponents[componentName] = loadedComponents
            .filter(loadedComponent => loadedComponent && loadedComponent.componentName === componentName)
            .map(loadedComponent => loadedComponent.component)
            .reduce((prev, curr) => curr, views[componentName].component);
    });

    const {app, defaultLayout} = viewComponents;


    // set routes
    routeElement = (
        <Route component={app}>
            <Route component={defaultLayout}>
                <Route name="home" path="/" component={viewComponents.home}/>
            </Route>
            <Route component={defaultLayout}>
                <Route name="items" path="/items" component={viewComponents.items}/>
            </Route>
            <Route component={defaultLayout}>
                <Route name="notFound" path="*" component={viewComponents.home}/>
            </Route>
        </Route>
    );

    return routeElement;
}

// return builded routes
export function getRouteElement() {
    return routeElement;
}

export function setRoutes(routes) {
    plainRoutes = routes;
}

export function getRoutes() {
    return plainRoutes;
}

// route dependencies
const getComponentDataDependency = (component = {}) => {
    return component ? component.fetchData : null;
};

const getComponentSeoDependency = (component = {}) => {
    return component ? component.fetchSeo : null;
};

const getLazyComponent = (component = {}) => {
    return component.WrappedComponent ?
        getLazyComponent(component.WrappedComponent) :
        component.fetchComponent;
};

export function getRouteComponents(components) {
    return components.map(component => {
        const lazyComponent = getLazyComponent(component);
        return lazyComponent ? lazyComponent() : new Promise(resolve => resolve(component));
    });
}

export function getRouteSeo(components, store, location, params) {
    return components
        .filter((component) => getComponentSeoDependency(component)) // only look at ones with a static fetchData()
        .map(getComponentSeoDependency)                              // pull out fetch data methods
        .map(fetchSeo =>
            fetchSeo(store, location, params));
}

export function getRouteDependencies(components, store, location, params) {
    return components
        .filter((component) => getComponentDataDependency(component)) // only look at ones with a static fetchData()
        .map(getComponentDataDependency)                              // pull out fetch data methods
        .map(fetchData =>
            fetchData(store, location, params));
}

// utilities
export function parseQuery(query) {
    const parsedQuery = {};
    Object.keys(query).forEach((queryKey) => {
        set(parsedQuery, queryKey, query[queryKey]);
    });
    return parsedQuery;
}

function findPath(routeName, routes) {
    let foundPath = false;
    if (!routes) {
        return false;
    }
    routes.forEach(route => {
        if (foundPath) {
            return;
        }
        if (route.name === routeName) {
            foundPath = route.path;
        } else if (route.childRoutes) {
            foundPath = findPath(routeName, route.childRoutes);
        }
    });

    return foundPath;
}

export function buildUrl(routeName, params = {}) {
    const queryParams = {};

    let pathname = findPath(routeName, getRoutes());

    if (!pathname) {
        return false;
    }

    Object.keys(params).forEach(paramKey => {
        const regExp = new RegExp(':' + paramKey);
        if (regExp.test(pathname)) {
            pathname = pathname.replace(regExp, params[paramKey]);
        } else {
            queryParams[paramKey] = params[paramKey];
        }
    });

    const search = qs.stringify(queryParams);

    return {
        pathname,
        search: search ? '?' + search : ''
    };
}

export function createHref(location) {
    const {pathname, search = '', hash = ''} = location;

    return `${pathname}${search ? `${search}` : ''}${hash ? `${hash}` : ''}`;
}

function extractPath(string) {
    const match = string.match(/^https?:\/\/[^\/]*/);

    if (match === null) {
        return string;
    }

    return string.substring(match[0].length);
}


export function parsePath(path) {
    let pathname = extractPath(path);
    let search = '';
    let hash = '';

    const hashIndex = pathname.indexOf('#');
    if (hashIndex !== -1) {
        hash = pathname.substring(hashIndex);
        pathname = pathname.substring(0, hashIndex);
    }

    const searchIndex = pathname.indexOf('?');
    if (searchIndex !== -1) {
        search = pathname.substring(searchIndex);
        pathname = pathname.substring(0, searchIndex);
    }

    if (pathname === '') {
        pathname = '/';
    }

    return {
        pathname,
        search,
        hash
    };
}

export function buildHref(routeName, params = {}) {
    const {pathname, search} = buildUrl(routeName, params);

    return pathname + search;
}

reroute
=======

Express/Connect middleware for mapping equivalent request paths.
See the [npm](https://www.npmjs.org/package/rerouter) and [github](https://github.com/kdbanman/rerouter) pages.

### Usage

Declare a source -> target simple map

    {source: target,
     source: target,
     ...}

to make two or more `request.path` (or `request.route`) values equivalent in the remaining middleware chain.

This is done by rewriting node's request object [url](http://nodejs.org/api/http.html#http_message_url).
This propagates to express's request object [`path`](http://expressjs.com/api.html#req.path) and [`route`](http://expressjs.com/api.html#req.route) because they are `getters` from a [clever library](https://github.com/expressjs/parseurl) that uses memoization (and, importantly for us, invalidation) to get parsed URL properties.

All other request properties like headers or query parameters, are unaffected.

### Examples

Example: use a nonstandard index query page:

    var express = require('express'),
        rerouter = require('rerouter');

    app.use(rerouter({
        '/':            '/weird.html',
        '/index.html',  '/weird.html',
        '/index.htm',   '/weird.html'
    }));

Example: introduce a shortened user profile query route when you have already defined a longer version in your application later on

    var express = require('express'),
        rerouter = require('rerouter');

    app.use(rerouter({
        '/usr/id':     '/user/active/profile/id'
    }), 'dev');

    //  ^---^ notice the dev logging mode

### Equivalencies

Until options are introduced, all sources and targets are forced into this standard form:

- a leading slash
- all lowercase
- no trailing slash

which means all of these map objects are equivalent, with the first one standard:

    {'/':           '/example.html',
     '/usr/id':    '/users/active/profile/id'}

    {'':           'example.html',
     'usr/id':    'users/active/profile/id'}

    {'/':           '/example.html/',
     '/usr/id/':    '/users/active/profile/id/'}

Compliance with the URI spec (i.e. illegal character presence) is not yet tested.

### Roadmap

- validate source and target strings against the URI path spec

- allow case-sensitivity, strict trailing `/` behaviour, etc. options
    - mirror express's config set strings

- allow regex sources

- with regex sources, allow match references in the target

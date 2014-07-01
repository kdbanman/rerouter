var url = require('url');

module.exports = function (inputMap, opts)
{
    // per-rerouter source -> target map
    var map = {};

    // use options to conditionally log behaviour
    var devLog = function (logStr) {
        if (opts === 'dev' || opts.dev || opts.mode === 'dev')
            console.log(logStr);
    }

    // loop through all source -> target pairs in the input object to
    // validate, process, and add to module map
    Object.keys(inputMap).forEach( function (source) {
        var target = inputMap[source];
        
        // make sure all targets are strings
        if (typeof target !== 'string')
            throw new Error('Cannot reroute ' +
                            source +
                            ' to non-string ' +
                            JSON.stringify(target));

        // make sure all sources and targets start with slashes
        if (source[0] !== '/') source = '/' + source;
        if (target[0] !== '/') target = '/' + target;

        // make sure all sources and targets end without slashes if they are
        // not the empty index path, '/'
        if (source !== '/' && source[source.length - 1] === '/')
            source = source.substring(0, source.length - 1);
        if (target !== '/' && target[target.length - 1] === '/')
            target = target.substring(0, target.length - 1);

        // slam all things to lower case
        source = source.toLowerCase();
        target = target.toLowerCase();

        // add normalized source and targets to module map
        map[source] = target;

        devLog('reroute set from ' + source + ' to ' + target);
    });

    return function (req, res, next) {
        // mutate node request url
        var parsed = url.parse(req.url);

        if (map[parsed.pathname] !== undefined) {
            devLog('rerouting request path from ' +
                   parsed.pathname +
                   ' to ' +
                   map[parsed.pathname])

            parsed.pathname = map[req.route];

            req.url = url.format(parsed);
        }

        next();
    };
};

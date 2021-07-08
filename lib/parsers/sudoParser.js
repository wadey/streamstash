var regexes = [
    {
        name: 'command',
        regex: /^(.+) : TTY=(.+) ; PWD=(.+) ; USER=(.+?) ;(?: ENV=(.+) ;)? COMMAND=(.*)/,
        parts: [ 'user', 'tty', 'pwd', 'as_user', 'env', 'command' ]
    },
    {
        name: 'error',
        regex: /^(.+) : (.+?) ; TTY=(.+) ; PWD=(.+) ; USER=(.+?) ;(?: ENV=(.+) ;)? COMMAND=(.*)/,
        parts: [ 'user', 'error', 'tty', 'pwd', 'as_user', 'env', 'command' ]
    },
]

/**
 * Parses sudo log lines
 *
 * @param {String} message Message to try and parse
 *
 * @returns {parserResult}
 */
module.exports = function (message) {
    var parts = [],
        matched,
        data = {}

    regexes.some(function (group) {
        parts = group.regex.exec(message)
        if (parts) {
            matched = group
            return true
        }
    })

    if (!matched) {
        return { data: void 0, error: 'No matches' }
    }

    data.event = matched.name
    matched.parts.forEach(function (name, index) {
        if (parts[index + 1] !== undefined) {
            data[name] = parts[index + 1].trim()
        }
    })

    return { data: data, error: void 0 }

}

module.exports.propertyName = 'sudo'

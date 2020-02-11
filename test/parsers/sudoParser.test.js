var StreamStash = require('../../'),
    assertParserResult = require('./util').assertParserResult

describe('sudoParser', function () {

    it('Should parse simple command', function () {
        assertParserResult(
            StreamStash.parsers.sudoParser.raw,
            '    nate : TTY=pts/0 ; PWD=/home/nate/hi there/oops; ; USER=root ; COMMAND=/bin/ls ../oops; -l',
            {
                as_user: 'root',
                command: '/bin/ls ../oops; -l',
                event: 'command',
                pwd: '/home/nate/hi there/oops;',
                tty: 'pts/0',
                user: 'nate'
            }
        )
    })

    it('Should parse a sudo error', function () {
        assertParserResult(
            StreamStash.parsers.sudoParser.raw,
            '    someone : command not allowed ; TTY=pts/40 ; PWD=/home/somewhere ; USER=root ; COMMAND=/bin/something',
            {
                as_user: 'root',
                command: '/bin/something',
                error: 'command not allowed',
                event: 'error',
                pwd: '/home/somewhere',
                tty: 'pts/40',
                user: 'someone'
            }
        )
    })

    it('Should parse ENV variables properly', function () {
        assertParserResult(
            StreamStash.parsers.sudoParser.raw,
            '    ubuntu : TTY=pts/0 ; PWD=/home/ubuntu ; USER=root ; ENV=FOO=1 BAR=2 ; COMMAND=/bin/ls -l',
            {
                as_user: 'root',
                command: '/bin/ls -l',
                event: 'command',
                pwd: '/home/ubuntu',
                env: 'FOO=1 BAR=2',
                tty: 'pts/0',
                user: 'ubuntu'
            }
        )
    })

    it('Should parse ENV variables properly in the error case', function () {
        assertParserResult(
            StreamStash.parsers.sudoParser.raw,
            '    ubuntu : command not allowed ; TTY=pts/0 ; PWD=/home/ubuntu ; USER=root ; ENV=FOO=1 BAR=2 ; COMMAND=/bin/ls -l',
            {
                as_user: 'root',
                command: '/bin/ls -l',
                error: 'command not allowed',
                event: 'error',
                pwd: '/home/ubuntu',
                env: 'FOO=1 BAR=2',
                tty: 'pts/0',
                user: 'ubuntu'
            }
        )
    })
})

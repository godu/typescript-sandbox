export default {
    files: [
        'test/**/*',
        '!test/**/helpers/**/*'
    ],
    extensions: [
        'ts'
    ],
    require: [
        'ts-node/register/transpile-only'
    ]
}

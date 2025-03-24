import { expression, statements } from '@babel/template'

const identifiers = new Set([
    'event',
    'onEvent',
    'signal',
    'computed',
    'action',
    'effect',
    'onChange',
])

const arities = {
    event: 1,
    onEvent: 3,
    signal: 2,
    computed: 2,
    action: 2,
    effect: 2,
    onChange: 3,
}

// eslint-disable-next-line node/prefer-global/process
const isDevelopment = process.env.NODE_ENV === 'development'

export default function transform({ types: t }, _options) {
    const dispose = expression.ast('import.meta.hot.data.dispose')

    const hotReload = statements.ast(`
        if (import.meta.hot) {
            import.meta.hot.data.dispose ??= new Set()
            for (const dispose of import.meta.hot.data.dispose) dispose()
            import.meta.hot.data.dispose.clear()
        }
    `)

    return {
        name: 'signals-transform',
        visitor: {
            Program: {
                enter(path, state) {
                    state.disposeId = state.file.scope.generateUidIdentifier('dispose')
                    state.pathId = state.file.scope.generateUidIdentifier('path')
                    state.shouldInjectPath = false
                },
                exit(path, state) {
                    if (!state.shouldInjectPath) return

                    const filePath = state.filename
                        .slice(state.cwd.length + 1)
                        .replace(/\.[^/.]+$/, '')

                    path.unshiftContainer('body', t.variableDeclaration('const', [
                        t.variableDeclarator(state.pathId, t.stringLiteral(filePath)),
                    ]))

                    if (isDevelopment)
                        path.unshiftContainer('body', hotReload)
                },
            },
            CallExpression(path, state) {
                const name = path.node.callee.name
                if (!identifiers.has(name)) return

                state.shouldInjectPath = true

                const id = path.parent.type === 'VariableDeclarator'
                    ? path.parent.id.name
                    : undefined

                const meta = t.objectExpression([t.objectProperty(t.identifier('meta'), t.objectExpression([
                    id ? t.objectProperty(t.identifier('name'), t.stringLiteral(id)) : undefined,
                    t.objectProperty(t.identifier('path'), state.pathId),
                    t.objectProperty(t.identifier('line'), t.numericLiteral(path.node.loc.start.line)),
                    isDevelopment ? t.objectProperty(t.identifier('dispose'), dispose) : undefined,
                ].filter(Boolean)))])

                const arity = arities[name]

                if (path.node.arguments.length === arity - 1) {
                    path.node.arguments.push(meta)
                }
                else if (path.node.arguments.length === arity) {
                    const arg = path.node.arguments.at(-1)

                    if (arg.type === 'ObjectExpression') {
                        arg.properties = meta.properties.concat(arg.properties)
                    }
                    else if (arg.type === 'Identifier') {
                        path.node.arguments[1] = t.objectExpression([
                            ...meta.properties,
                            t.spreadElement(arg),
                        ])
                    }
                }
            },
        },
    }
}

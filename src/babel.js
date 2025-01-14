const identifiers = new Set(['signal', 'computed', 'action', 'effect', 'changeEffect'])
const arities = {
    signal: 2,
    computed: 2,
    action: 2,
    effect: 2,
    changeEffect: 3,
}

export default function transform({ types: t }, _options) {
    return {
        name: 'signals-metadata-transform',
        visitor: {
            Program: {
                enter(path, state) {
                    state.pathIdentifier = state.file.scope.generateUidIdentifier('path')
                    state.shouldInjectPath = false
                },
                exit(path, state) {
                    if (!state.shouldInjectPath) return
                    path.unshiftContainer('body', t.variableDeclaration('const', [
                        t.variableDeclarator(state.pathIdentifier, t.stringLiteral(state.filename.slice(state.cwd.length))),
                    ]))
                },
            },
            CallExpression(path, state) {
                if (!identifiers.has(path.node.callee.name)) return
                state.shouldInjectPath = true

                const parentNode = path.parent

                const idProp = parentNode.type === 'VariableDeclarator'
                    ? t.objectProperty(t.identifier('id'), t.stringLiteral(parentNode.id.name))
                    : undefined

                const pathProp = t.objectProperty(t.identifier('path'), t.templateLiteral([
                    t.templateElement({ raw: '' }),
                    t.templateElement({ raw: `:${path.node.loc.start.line}` }),
                ], [state.pathIdentifier]))

                const props = t.objectExpression([idProp, pathProp].filter(Boolean))

                const name = path.node.callee.name
                const arity = arities[name]

                if (path.node.arguments.length === arity - 1) {
                    path.node.arguments.push(props)
                }
                else if (path.node.arguments.length === arity) {
                    const arg = path.node.arguments.at(-1)

                    if (arg.type === 'ObjectExpression') {
                        arg.properties = props.properties.concat(arg.properties)
                    }
                    else if (arg.type === 'Identifier') {
                        path.node.arguments[1] = t.objectExpression([
                            ...props.properties,
                            t.spreadElement(arg),
                        ])
                    }
                }
            },
        },
    }
}

import antfu from '@antfu/eslint-config'
import reactCompiler from 'eslint-plugin-react-compiler'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu(
    {
        yaml: false,
        react: true,
        typescript: true,
        formatters: {
            css: true,
        },
        stylistic: {
            indent: 4,
        },
        rules: {
            'antfu/if-newline': 'off',
            'ts/consistent-type-definitions': 'off',
            'style/comma-dangle': ['error', 'always-multiline'],
            'react/no-array-index-key': 'off',
            'eslint-comments/no-unlimited-disable': 'off',
        },
        settings: {
            tailwindcss: {
                callees: ['tv', 'twJoin', 'twMerge'],
            },
        },
    },
    tailwind.configs['flat/recommended'],
    {
        rules: {
            'tailwindcss/no-custom-classname': 'off',
        },
    },
    {
        name: 'react-compiler/recommended',
        plugins: {
            'react-compiler': reactCompiler,
        },
        rules: {
            'react-compiler/react-compiler': 'error',
        },
    },
)

import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu(
    {
        yaml: false,
        react: true,
        typescript: true,
        stylistic: {
            indent: 4,
        },
        rules: {
            'antfu/if-newline': 'off',
            'ts/consistent-type-definitions': 'off',
            'style/comma-dangle': ['error', 'always-multiline'],
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
)

import Path from 'node:path'
import Bun from 'bun'

const glob = new Bun.Glob('*.json')

const data = []

for await (const fileName of glob.scan('lucide-main/icons/')) {
    const iconData = await Bun.file(`lucide-main/icons/${fileName}`).json()
    const iconName = Path.parse(fileName).name
    const iconExists = await Bun.file(`node_modules/lucide-react/dist/esm/icons/${iconName}.js`).exists()

    if (!iconExists) {
        console.warn(`Icon "${iconName}" does not exist!`)
        continue
    }

    data.push({
        name: iconName,
        tags: [...iconData.tags, ...iconData.categories],
    })
}

Bun.write('src/config/icons.ts', `/* eslint-disable */\nimport type { IconName } from 'lucide-react/dynamic'\nexport const icons = ${JSON.stringify(data)} as unknown as { name: IconName, tags: string[] }[]`)

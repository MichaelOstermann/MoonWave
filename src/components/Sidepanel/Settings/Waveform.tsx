import type { WaveformTheme, WaveformThemeName } from '@app/types'
import type { ComponentProps, ReactNode } from 'react'
import { setWaveformTheme } from '@app/actions/app/setWaveformTheme'
import { $accent } from '@app/state/theme/accent'
import { $waveformThemeName } from '@app/state/theme/waveformThemeName'
import { waveformThemes } from '@app/themes/waveforms'
import { useSignal } from '@monstermann/signals'
import { useWavesurfer } from '@wavesurfer/react'
import { LucideAudioLines } from 'lucide-react'
import { useRef } from 'react'
import { Section } from '../Section'
import { SectionBody } from '../SectionBody'
import { SectionHeader } from '../SectionHeader'

const themes: WaveformThemeName[] = ['bars-bottom', 'bars-center', 'hifi']

export function Waveform(): ReactNode {
    const currentTheme = useSignal($waveformThemeName)

    return (
        <Section>
            <SectionHeader
                title="Waveform"
                icon={LucideAudioLines}
            />
            <SectionBody>
                <div className="grid w-full grid-cols-[1fr_1fr_1fr] items-start gap-x-3">
                    {themes.map((theme) => {
                        return (
                            <WaveformOption
                                key={theme}
                                isActive={theme === currentTheme}
                                theme={waveformThemes[theme]}
                                onClick={() => setWaveformTheme(theme)}
                            />
                        )
                    })}
                </div>
            </SectionBody>
        </Section>
    )
}

const peaks = [[0.3578, 0.2972, 0.513, 0.0161, 0.3832, 0.3025, 0.5857, 0.4355, 0.2653, 0.4154, 0.2954, 0.6476, 0.0127, 0.4074, 0.2951, 0.5696, 0.3406, 0.3735, 0.3012, 0.5594, 0.5091, 0.0125, 0.404, 0.2974, 0.529, 0.0917, 0.3904, 0.303, 0.4654, 0.4784, 0.3318, 0.4007, 0.3078, 0.511, 0.0609, 0.3847, 0.2982, 0.4837, 0.4911, 0.3454, 0.3384, 0.4684, 0.5329, 0.0302, 0.3354, 0.2987, 0.5413, 0.0275, 0.3746, 0.2995, 0.4683, 0.5225, 0.2745, 0.3877, 0.2958, 0.495, 0.0113, 0.3391, 0.3041, 0.5685, 0.3622, 0.3374, 0.3237, 0.4515, 0.4958, 0.0129, 0.3533, 0.3193, 0.5472, 0.126, 0.3531, 0.3291, 0.7052, 0.6604, 0.3407, 0.6679, 0.302, 0.669, 0.0733, 0.5815, 0.5418, 0.6393, 0.5013, 0.6535, 0.7545, 0.587, 0.6229, 0.3191, 0.5942, 0.544, 0.6623, 0.1215, 0.5686, 0.5523, 0.5226, 0.7027, 0.2992, 0.6819, 0.3068, 0.9065, 0.0214, 0.5464, 0.3209, 0.74, 0.6938, 0.5406, 0.5715, 0.5552, 0.8618, 0.0203, 0.596, 0.56, 0.5605, 0.3845, 0.7623, 0.5783, 0.7079, 0.7822, 0.0203, 0.7314, 0.3017, 0.732, 0.1068, 0.6278, 0.5502, 0.8027, 0.6282, 0.5691, 0.557, 0.538, 0.6715, 0.3451, 0.7753, 0.3143, 0.4953, 0.5133, 0.3764, 0.3494, 0.5183, 0.4944, 0.0402, 0.3394, 0.2973, 0.7273, 0.0478, 0.7259, 0.4751, 0.6675, 0.6473, 0.4434, 0.637, 0.5399, 0.6435, 0.4048, 0.5668, 0.5327, 0.5715, 0.5299, 0.5409, 0.5574, 0.6111, 0.7358, 0.0188, 0.5848, 0.5203, 0.5954, 0.3607, 0.5437, 0.5967, 0.7195, 0.6969, 0.0164, 0.5216, 0.3281, 0.6711, 0.072, 0.566, 0.3087, 0.7231, 0.526, 0.6258, 0.6923, 0.5266, 0.6865, 0.3, 0.5957, 0.3079, 0.7251, 0.4939, 0.793, 0.5609, 0.6713, 0.6098, 0.0272, 0.6002, 0.5344, 0.6604, 0.0232, 0.5742, 0.7127, 0.789, 0.6528, 0.5287, 0.76, 0.3106, 0.5574, 0.0136, 0.3292, 0.3064, 0.509, 0.328, 0.4551, 0.4127, 0.5161, 0.7041, 0.0574, 0.646, 0.3221, 0.7431, 0.1357, 0.6626, 0.6158, 0.6212, 0.6162, 0.3583, 0.6766, 0.62, 0.6564, 0.2716, 0.5829, 0.6037, 0.7945, 0.6684, 0.666, 0.6855, 0.7449, 0.2905, 0.5313, 0.4284, 0.8064, 0.1179, 0.6664, 0.7373, 0.6901, 0.6887, 0.1399, 0.6454, 0.5508, 0.6532, 0.4329, 0.8485, 0.3209, 0.7297, 0.6493, 0.5068, 0.5969, 0.5328, 0.7106, 0.2996, 0.6438, 0.3795, 0.7558, 0.1328, 0.6735, 0.6281, 0.6276, 0.6849, 0.4376, 0.6767, 0.356, 0.7643, 0.1008, 0.6459, 0.6062, 0.7104, 0.6281, 0.5022, 0.5541, 0.4728, 0.6978, 0.2722, 0.4324, 0.417, 0.7627, 0.4876, 0.6077, 0.5891, 0.549, 0.6987, 0.0523, 0.6085, 0.5982, 0.658, 0.2896, 0.6229, 0.6257, 0.8193, 0.6862, 0.4228, 0.5858, 0.5685, 0.7339, 0.0914, 0.6561, 0.6514, 0.6457, 0.5213, 0.5311, 0.5307, 0.5768, 0.7986, 0.0501, 0.5744, 0.4199, 0.7167, 0.1186, 0.6163, 0.6004, 0.6905, 0.6501, 0.4454, 0.6691, 0.4323, 0.6803, 0.0997, 0.6083, 0.561, 0.5287, 0.5619, 0.5811, 0.4337, 0.0326, 0.3845, 0.0206, 0.6761, 0.368, 0.6301, 0.3862, 0.6845, 0.6118, 0.5169, 0.6831, 0.5428, 0.7441, 0.6289, 0.5588, 0.5279, 0.6526, 0.5095, 0.5986, 0.5637, 0.0381, 0.0028, 0.0002, 0, 0]]

interface WaveformOptionProps extends ComponentProps<'div'> {
    theme: WaveformTheme
    isActive: boolean
}

function WaveformOption({
    theme,
    isActive,
    ...rest
}: WaveformOptionProps): ReactNode {
    const container = useRef<HTMLDivElement>(null)
    const waveColor = useSignal($accent)

    useWavesurfer({
        container,
        duration: 1,
        peaks,
        height: 'auto',
        mediaControls: false,
        hideScrollbar: true,
        barHeight: 0.8,
        cursorColor: 'rgba(0, 0, 0, 0)',
        waveColor,
        interact: false,
        ...theme,
    })

    return (
        <div
            {...rest}
            className="relative"
        >
            <div
                {...rest}
                ref={container}
                className="h-16 overflow-hidden rounded-md border border-[--border]"
            />
            {isActive && <div className="absolute inset-0 rounded-md border-2 border-[--accent]" />}
        </div>
    )
}

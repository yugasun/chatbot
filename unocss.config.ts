import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss';

export default defineConfig({
    include: [/\.(vue|svelte|[jt]sx?|mdx?|html)($|\?)/],
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            scale: 1.2,
            warn: true,
        }),
        presetTypography(),
    ],
    theme: {
        colors: {
            primary: '#333333',
            green: '#42b983',
        },
    },
    transformers: [transformerDirectives(), transformerVariantGroup()],
});

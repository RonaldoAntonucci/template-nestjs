import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        root: 'src',
        environment: 'node',
        clearMocks: true,
        coverage: {
            reportsDirectory: '../coverage',
            exclude: [
                '**/*.module.ts',
                '**/*.config.ts',
                '**/*.dto.ts',
                '**/*.guard.ts',
                '**/*.decorator.ts',
                '**/*.types.ts',
                '**/*.entity.ts',
                '**/*.enum.ts',
                '**/*.interface.ts',
                '**/*.type.ts',
                '**/**sse.**.ts',
                '**/anthropometry/**',
                '**/migrations/**',
                'main.ts',
                'metadata.ts',
                ...coverageConfigDefaults.exclude,
            ],
            provider: 'v8',
            thresholds: {
                100: true,
            },
        },
    },
    plugins: [
        // This is required to build the test files with SWC
        swc.vite({
            // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
            module: { type: 'es6' },
        }),
        tsconfigPaths(),
    ],
});

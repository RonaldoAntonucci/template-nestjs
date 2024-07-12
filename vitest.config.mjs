import swc from 'unplugin-swc';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

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
                '**/*.entity.ts',
                '**/*.enum.ts',
                '**/**sse.**.ts',
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

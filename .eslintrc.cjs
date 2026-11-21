module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'no-restricted-globals': [
      'error',
      { name: 'Intl', message: 'Gunakan formatRupiah dari src/lib/formatRupiah.ts (BR-11).' },
    ],
    'no-restricted-properties': [
      'error',
      { object: 'window', property: 'Intl', message: 'Dilarang (BR-11).' },
      { object: 'globalThis', property: 'Intl', message: 'Dilarang (BR-11).' },
      { property: 'toLocaleString', message: 'Dilarang: menyisipkan spasi non-breaking (BR-11).' },
      { property: 'toLocaleDateString', message: 'Dilarang (BR-11).' },
      { property: 'toLocaleTimeString', message: 'Dilarang (BR-11).' },
      { property: 'toFixed', message: 'Dilarang: gunakan aritmetika bilangan bulat (BR-01).' },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
  },
  overrides: [
    {
      files: ['src/lib/**/*.ts', 'src/state/**/*.ts', 'src/data/**/*.ts'],
      rules: {
        'no-restricted-globals': [
          'error',
          { name: 'Intl', message: 'Gunakan formatRupiah dari src/lib/formatRupiah.ts (BR-11).' },
          { name: 'window', message: 'Dilarang di lapisan murni (F-03).' },
          { name: 'document', message: 'Dilarang di lapisan murni (F-03).' },
          { name: 'localStorage', message: 'Dilarang di lapisan murni (F-03).' },
          { name: 'crypto', message: 'Dilarang di lapisan murni (F-03).' },
        ],
        'no-restricted-imports': [
          'error',
          { paths: [
            { name: 'react', message: 'Dilarang di lapisan murni (F-03).' },
            { name: 'react-dom', message: 'Dilarang di lapisan murni (F-03).' },
            { name: 'react-router-dom', message: 'Dilarang di lapisan murni (F-03).' },
            { name: 'lucide-react', message: 'Dilarang di lapisan murni (F-03).' },
          ]},
        ],
      },
    },
  ],
};

import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import eslint from '@eslint/js';

// Native 방식 사용
/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. 전역 무시
  { ignores: ['dist', 'node_modules', 'public'] },
  // 2. 기본 권장 설정
  eslint.configs.recommended, // eslint 권장
  ...tseslint.configs.recommended, // ts-eslint 권장
  // 3. 상세 설정
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      import: importPlugin,
      prettier: eslintPluginPrettier,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest', // 1. 최신 문법 (Optional Chaining 등) 사용
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // any 타입 허용
      '@typescript-eslint/no-unused-vars': 'warn', // 미사용 변수 경고
      'import/export': 'error', // import/export 규칙
      'import/no-duplicates': 'warn', // import 중복 시 경고
      ...importPlugin.configs.typescript.rules,
      // Prettier
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Node.js 내장 모듈
            [ '^(assert|buffer|child_process|cluster|crypto|dgram|dns|events|fs|http|https|net|os|path|perf_hooks|process|querystring|readline|repl|stream|string_decoder|timers|tls|tty|url|util|v8|vm|worker_threads|zlib)(/.*|$)', ],
            // 2. React, Axios 등의 외부 라이브러리
            [ '^\\w' ],
            // 3. 경로 별칭 (Alias)
            [ '^@' ],
            // 4. 상대 경로
            [ '^\\.' ],
            // 5. JSON 파일
            [ '^.+\\.json$'],
            // 6. Typescript type 관련
            [ '^import\\s+type'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      // React
      'react/jsx-uses-react': 'error', // JSX에서 React 사용 시, error
      'react/prop-types': 'off', // Typescript에서 Proptypes 비활성화
      'react-hooks/rules-of-hooks': 'error', // Hook을 반복문, 조건문, 중첩된 함수 내에서 호출하지 않도록 함
      'react-hooks/exhaustive-deps': 'warn', // useEffect 등의 의존성 배열 검사
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // React Fast Refresh 관련: 컴포넌트만 export 하도록 유도 (전체 페이지 새로고침 방지)
      ],
    },
  },
  eslintConfigPrettier,
];
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // JSX 지원 활성화
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // React 범위 규칙 비활성화
      "react/prop-types": "off", // PropTypes 규칙 비활성화
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];

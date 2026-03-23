import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import { join } from 'node:path';

const DATA_DIR = '/Users/yoogeon/.claude/skills/ui-ux-pro-max/data';
const OUT_DIR = join(import.meta.dirname, '..', 'src', 'data');

mkdirSync(OUT_DIR, { recursive: true });

interface CsvMapping {
  input: string;
  output: string;
}

const mappings: CsvMapping[] = [
  { input: 'styles.csv', output: 'styles.json' },
  { input: 'colors.csv', output: 'colors.json' },
  { input: 'typography.csv', output: 'typography-pairs.json' },
  { input: 'ux-guidelines.csv', output: 'ux-guidelines.json' },
  { input: 'charts.csv', output: 'charts.json' },
  { input: 'landing.csv', output: 'landing.json' },
  { input: 'products.csv', output: 'products.json' },
  { input: 'ui-reasoning.csv', output: 'reasoning.json' },
  { input: 'icons.csv', output: 'icons.json' },
  { input: 'web-interface.csv', output: 'web-interface.json' },
];

const STACKS_DIR = join(DATA_DIR, 'stacks');

interface StackCsvMapping {
  input: string;
  output: string;
}

const stackMappings: StackCsvMapping[] = [
  { input: 'html-tailwind.csv', output: 'stack-html-tailwind.json' },
  { input: 'react.csv', output: 'stack-react.json' },
  { input: 'nextjs.csv', output: 'stack-nextjs.json' },
  { input: 'vue.csv', output: 'stack-vue.json' },
  { input: 'svelte.csv', output: 'stack-svelte.json' },
  { input: 'swiftui.csv', output: 'stack-swiftui.json' },
  { input: 'react-native.csv', output: 'stack-react-native.json' },
  { input: 'flutter.csv', output: 'stack-flutter.json' },
  { input: 'shadcn.csv', output: 'stack-shadcn.json' },
  { input: 'jetpack-compose.csv', output: 'stack-jetpack-compose.json' },
  { input: 'astro.csv', output: 'stack-astro.json' },
  { input: 'nuxtjs.csv', output: 'stack-nuxtjs.json' },
  { input: 'nuxt-ui.csv', output: 'stack-nuxt-ui.json' },
];

for (const { input, output } of mappings) {
  const csv = readFileSync(join(DATA_DIR, input), 'utf-8');
  const records: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    relax_quotes: true,
  });
  writeFileSync(join(OUT_DIR, output), JSON.stringify(records, null, 2));
  console.log(`${input} -> ${output} (${records.length} records)`);
}

for (const { input, output } of stackMappings) {
  const csv = readFileSync(join(STACKS_DIR, input), 'utf-8');
  const records: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    relax_quotes: true,
  });
  writeFileSync(join(OUT_DIR, output), JSON.stringify(records, null, 2));
  console.log(`stacks/${input} -> ${output} (${records.length} records)`);
}

console.log('Done!');

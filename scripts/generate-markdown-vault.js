import { mkdir, writeFile } from 'node:fs/promises';
import { categories } from '../src/data/categories.js';
import { prompts } from '../src/data/prompts.js';

await mkdir(new URL('../prompts/', import.meta.url), { recursive: true });
for (const category of categories) {
  const items = prompts.filter((prompt) => prompt.category === category.id);
  const content = `# ${category.name} prompts\n\n${category.description}\n\n${items
    .map((prompt) => {
      const variables = prompt.variables
        .map(
          (field) =>
            `| \`{{${field.key}}}\` | ${field.label} | ${field.default.replaceAll('|', '\\|').replaceAll('\n', ' ')} |`,
        )
        .join('\n');
      return `## ${prompt.title}\n\n${prompt.description}\n\n**Compatible tools:** ${prompt.tools.join(', ')}  \n**Level:** ${prompt.level}  \n**Tags:** ${prompt.tags.join(', ')}\n\n\`\`\`text\n${prompt.template}\n\`\`\`\n\n### Make it yours\n\n| Field | Description | Example |\n| --- | --- | --- |\n${variables}\n\n**Tip:** ${prompt.tip}\n`;
    })
    .join(
      '\n---\n\n',
    )}\n\n---\n\nGenerated from \`src/data/prompts.js\`. Edit the catalog and run \`npm run generate:docs\` to update this file.\n`;
  await writeFile(new URL(`../prompts/${category.id}.md`, import.meta.url), content);
  console.log(`${category.name}: ${items.length} prompts`);
}
console.log(`\nPublished ${prompts.length} prompts across ${categories.length} categories.`);

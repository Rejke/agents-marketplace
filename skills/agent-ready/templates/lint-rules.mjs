// Repository boundaries from AGENTS.md that a linter can hold (oxlint or ESLint JS plugin).
// Wire up: jsPlugins: ["./scripts/lint-rules.mjs"], then enable per directory in overrides.
// Import bans need no plugin: use no-restricted-imports with patterns in an override.

// table identifier → the only files that may insert, update or delete it
const OWNERS = {
  // auditLog: ["src/audit.ts"],
};

const ownedWrites = {
  meta: {
    messages: {
      foreign: "{{table}} is written only by {{owners}}; call its owner instead (AGENTS.md, Boundaries).",
    },
  },
  create(context) {
    const file = context.filename.replaceAll("\\", "/");
    if (/\.test\.[cm]?[jt]sx?$/.test(file)) return {};
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type !== "MemberExpression" || callee.property.type !== "Identifier") return;
        if (!["insert", "update", "delete"].includes(callee.property.name)) return;
        const table = node.arguments[0];
        if (table?.type !== "Identifier" || !Object.hasOwn(OWNERS, table.name)) return;
        const owners = OWNERS[table.name];
        if (owners.some((owner) => file.endsWith(owner))) return;
        context.report({
          node,
          messageId: "foreign",
          data: { table: table.name, owners: owners.join(", ") },
        });
      },
    };
  },
};

export default {
  meta: { name: "repo" },
  rules: { "owned-writes": ownedWrites },
};

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Mapping } from "@tiptap/pm/transform";

export const AutoLinkPreview = Extension.create({
  name: "autoLinkPreview",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("autoLinkPreview"),

        appendTransaction(transactions, oldState, newState) {
          if (!transactions.some((tr) => tr.docChanged)) {
            return null;
          }

          const { doc, schema } = newState;
          const oldDoc = oldState.doc;
          const mapping = new Mapping();
          const inserts: Array<{ pos: number; url: string }> = [];
          const queuedInserts = new Set<string>();

          for (const transaction of transactions) {
            mapping.appendMapping(transaction.mapping);
          }

          const newToOldMapping = mapping.invert();

          const safeNodeAt = (targetDoc: typeof doc, pos: number) => {
            try {
              return targetDoc.nodeAt(pos);
            } catch {
              return null;
            }
          };

          doc.descendants((node, pos) => {
            if (!node.isText) return;

            const linkMark = node.marks.find(
              (m) => m.type.name === "link" && m.attrs?.href
            );
            if (!linkMark) return;

            const url = linkMark.attrs.href;

            // Skip if link already existed
            const oldPos = newToOldMapping.map(pos, -1);
            const existedBefore = safeNodeAt(oldDoc, oldPos)?.marks.some(
              (m) => m.type.name === "link" && m.attrs.href === url
            );

            if (existedBefore) return;

            const $pos = doc.resolve(pos);
            if ($pos.parent.type.name !== "paragraph") return;

            const paragraphEnd = $pos.end();

            // Skip if preview already exists
            const nextNode = safeNodeAt(doc, paragraphEnd);
            if (
              nextNode?.type.name === "linkPreview" &&
              nextNode.attrs.url === url
            ) {
              return;
            }

            const insertKey = `${paragraphEnd}:${url}`;
            if (queuedInserts.has(insertKey)) {
              return;
            }

            queuedInserts.add(insertKey);
            inserts.push({ pos: paragraphEnd, url });
          });

          if (!inserts.length) return null;

          const tr = newState.tr;

          // Insert bottom → top to avoid shifting
          inserts
            .sort((a, b) => b.pos - a.pos)
            .forEach(({ pos, url }) => {
              const paragraph = schema.nodes.paragraph?.create();
              const preview = schema.nodes.linkPreview?.create({ url });

              if (paragraph && preview) {
                tr.insert(pos, [paragraph, preview]);
              }
            });

          return tr.docChanged ? tr : null;
        },
      }),
    ];
  },
});

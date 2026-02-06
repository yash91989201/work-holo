import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

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
          const inserts: Array<{ pos: number; url: string }> = [];

          doc.descendants((node, pos) => {
            if (!node.isText) return;

            const linkMark = node.marks.find(
              (m) => m.type.name === "link" && m.attrs?.href
            );
            if (!linkMark) return;

            const url = linkMark.attrs.href;

            // Skip if link already existed
            const existedBefore = oldDoc
              .nodeAt(pos)
              ?.marks.some(
                (m) => m.type.name === "link" && m.attrs.href === url
              );

            if (existedBefore) return;

            const $pos = doc.resolve(pos);
            if ($pos.parent.type.name !== "paragraph") return;

            const paragraphEnd = $pos.end();

            // Skip if preview already exists
            const nextNode = doc.nodeAt(paragraphEnd);
            if (
              nextNode?.type.name === "linkPreview" &&
              nextNode.attrs.url === url
            ) {
              return;
            }

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

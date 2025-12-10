import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useCallback } from "react";
import { LinkPreview } from "./link-preview";

interface LinkPreviewAttrs {
  url: string;
}

export function LinkPreviewComponent(props: NodeViewProps) {
  const url = (props.node.attrs as LinkPreviewAttrs).url;

  const handleClose = useCallback(() => {
    if (props.deleteNode) {
      props.deleteNode();
    }
  }, [props]);

  return (
    <NodeViewWrapper className="link-preview-wrapper">
      <LinkPreview onClose={handleClose} showCloseButton url={url} />
    </NodeViewWrapper>
  );
}

import {Editor, IAllProps} from '@tinymce/tinymce-react';
import React, {useCallback, useLayoutEffect, useRef} from 'react';
import {Editor as EditorType} from 'tinymce';

interface EditorProps extends IAllProps {
  autoResize?: boolean;
  containerClass?: string;
  child?: JSX.Element;
}

type EditorContainerRef = {
  extraHeight?: number;
} & React.MutableRefObject<HTMLDivElement | null>;

export const TinyMCEEditor: React.FC<EditorProps> = ({
  autoResize,
  containerClass,
  child,
  ...props
}) => {
  const editorRef = useRef<EditorType | null>(null);
  const editorContainerRef: EditorContainerRef = useRef<HTMLDivElement>(null);

  const adjustEditorHeight = useCallback(
    (editor: EditorType) => {
      if (editorContainerRef.current) {
        editorContainerRef.current.style.height =
          (editorContainerRef.extraHeight ?? 0) +
          editor.getBody().getBoundingClientRect().height +
          'px';
      }
    },
    [editorContainerRef.current, editorContainerRef.extraHeight]
  );

  const handleInit = useCallback((event: any, editor: EditorType) => {
    if (editor.plugins && editor.plugins.link) {
      // Disable automatic URL shortening
      editor.plugins.link.target = '_blank';
      editor.plugins.link.autoUrlConvert = false;
    }
    editorRef.current = editor;
    const editorHeight = editor.getBody().getBoundingClientRect().height;
    const editorContainerHeight =
      editor.getContainer().getBoundingClientRect().height ?? editorHeight;
    editorContainerRef.extraHeight = editorContainerHeight - editorHeight;
    props.onInit?.(event, editor);
  }, []);

  useLayoutEffect(() => {
    if (editorRef.current) adjustEditorHeight(editorRef.current);
  }, [props.value]);

  if (child && !autoResize) {
    return (
      <div className={containerClass}>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API ?? ''}
          {...props}
        />
        {child}
      </div>
    );
  }

  if (!autoResize)
    return (
      <Editor apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API ?? ''} {...props} />
    );

  return (
    <div ref={editorContainerRef} className={containerClass}>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API ?? ''}
        {...props}
        onInit={handleInit}
      />
      {child}
    </div>
  );
};

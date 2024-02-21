import React, { forwardRef } from 'react';

interface ContentPropsType {
  content: string;
  getContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ContentTextarea = forwardRef<HTMLTextAreaElement, ContentPropsType>(
  ({ content, getContent }, ref) => {
    return (
      <div className="flex justify-between">
        <textarea
          className="w-full h-96 p-4 border-none outline-none resize-none"
          placeholder="내용"
          name="content"
          onInput={getContent}
          maxLength={10000}
          ref={ref}
          defaultValue={content}
        />
        <div className="self-end w-20 text-sm p-0.5">
          {content.length} / 10000
        </div>
      </div>
    );
  }
);

export default ContentTextarea;

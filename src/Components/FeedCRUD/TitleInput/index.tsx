import React, { forwardRef } from 'react';

interface TitleContentPropsType {
  title: string;
  getTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleInput = forwardRef<HTMLInputElement, TitleContentPropsType>(
  ({ title, getTitle }, ref) => {
    return (
      <div className="flex justify-between border-b border-b-[#f1f1f1]">
        <input
          className="w-full p-4 text-xl border-none outline-none"
          type="text"
          name="title"
          placeholder="제목"
          onInput={getTitle}
          maxLength={30}
          ref={ref}
          defaultValue={title}
        />
        <div
          className={`${
            title.length === 30 && 'text-mainred'
          } self-end w-16 text-sm p-0.5`}
        >
          {title.length} / 30
        </div>
      </div>
    );
  }
);

export default TitleInput;

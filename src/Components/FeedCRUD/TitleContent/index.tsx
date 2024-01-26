interface TitleContentPropsType {
  title: string;
  content: string;
  getTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TitleContent = ({
  title,
  content,
  getTitle,
  getContent,
}: TitleContentPropsType) => {
  return (
    <div className="w-full mx-auto my-0 my-4">
      <h2>제목 및 내용</h2>
      <div className="flex flex-col p-4 mx-auto bg-white rounded-md">
        <div className="flex justify-between border-b border-b-[#f1f1f1]">
          <input
            className="w-full p-4 text-xl border-none outline-none"
            type="text"
            name="title"
            placeholder="제목"
            onInput={getTitle}
            maxLength={30}
            // ref={inputValueRef}
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
        <div className="flex justify-between">
          <textarea
            className="w-full h-96 p-4 border-none outline-none resize-none"
            placeholder="내용"
            name="content"
            onInput={getContent}
            maxLength={10000}
            // ref={textareaValueRef}
            defaultValue={content}
          />
          <div className="self-end w-20 text-sm p-0.5">
            {content.length} / 10000
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleContent;

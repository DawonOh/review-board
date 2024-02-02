export const LoadingIcon = () => {
  return (
    <div className="flexCenterAlign gap-2 w-full h-full absolute top-0 left-0 bg-black/50">
      <div className="w-4 h-4 rounded-full bg-white animate-[loader-scale_500ms_ease-in-out_alternate_infinite]" />
      <div className="w-4 h-4 rounded-full bg-mainblue animate-[loader-scale_500ms_ease-in-out_alternate_250ms_infinite]" />
      <div className="w-4 h-4 rounded-full bg-white animate-[loader-scale_500ms_ease-in-out_alternate_500ms_infinite]" />
    </div>
  );
};

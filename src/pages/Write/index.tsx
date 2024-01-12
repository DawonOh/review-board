import { Fragment } from 'react';

import { MobileMenu, WriteContainer } from 'Components';

export const WriteFeed = () => {
  return (
    <Fragment>
      <MobileMenu />
      <div className="w-full h-noScroll relate my-0 mx-auto bg-bg-gray">
        <WriteContainer />
      </div>
    </Fragment>
  );
};

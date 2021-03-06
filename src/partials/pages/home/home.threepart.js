import React, { useState } from 'react';

import { VisibleLoader } from 'components/loader';
import { Fader } from 'components/transitioner.js';
import { cloudinary } from 'constants/settings.js';
import css from 'styles/pages/Home.module.scss';

const ThreePart = () => {
  const [isInView, setInView] = useState(false);
  return (
    <VisibleLoader setInView={setInView}>
      <div className={css['home-threepart']}>
        <Part
          headline={'Enlightenment'}
          description={
            'Facilitating open-floor conversation to shape the minds and alter the perspectives of participants.'
          }
          image={'three-part-1.jpg'}
          isInView={isInView}
        />
        <Part
          headline={'Expression'}
          description={
            'Providing a safe-space for freedom of expression and opinions to be heard.'
          }
          image={'three-part-2.jpg'}
          isInView={isInView}
        />
        <Part
          headline={'Community'}
          description={
            'Encouraging unity amongst the community irrespective of social status or background.'
          }
          image={'three-part-3.jpg'}
          isInView={isInView}
        />
      </div>
    </VisibleLoader>
  );
};

const Part = ({ headline, description, image, isInView }) => {
  const src = `${cloudinary.url}/public/fillers/${image}`;

  return (
    <Fader
      determinant={isInView}
      duration={750}
      postTransitions={'transform .3s ease 0s'}
      className={css['home-threepart-part']}
      style={{ backgroundImage: `url(${src})` }}>
      <div className={css['home-threepart-caption']}>
        <div className={css['home-threepart-headline']}>{headline}</div>
        <div className={css['home-threepart-description']}>{description}</div>
      </div>
    </Fader>
  );
};
export default ThreePart;

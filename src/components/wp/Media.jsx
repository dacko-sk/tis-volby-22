// import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { imgPath } from '../../api/helpers';

function Media(props) {
  let src = '/loading.gif';
  let alt = 'media';

  const { isLoading, error, data } = useQuery(
    ['media_' + props.id],
    () => fetch('https://cms.transparency.sk/wp-json/wp/v2/media/' + props.id).then(response => {
      // must return promise
      return response.json()
    })
  );

  if (!isLoading && !error) {
    src = data.hasOwnProperty('source_url') ? data.source_url : imgPath('politician.png');
    alt = data.hasOwnProperty('alt_text') ? data.alt_text : alt;
  }

  return <img src={src} alt={alt} />;
}

export default Media;

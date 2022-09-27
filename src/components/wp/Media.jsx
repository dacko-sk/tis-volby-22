import { useQuery } from '@tanstack/react-query';
import has from 'has';
import { images } from '../../api/constants';
import { imgPath } from '../../api/helpers';
import Loading from '../general/Loading';

function Media({ alt, id, fallback }) {
    const { isLoading, error, data } = useQuery(
        [`media_${id}`],
        () =>
            fetch(`https://cms.transparency.sk/wp-json/wp/v2/media/${id}`).then(
                (response) => response.json()
            ),
        {
            enabled: id > 0,
        }
    );

    if ((id > 0 && isLoading) || error) {
        return <Loading small error={error} />;
    }

    const src =
        data && has(data, 'source_url')
            ? data.source_url
            : imgPath(fallback || images.news);

    return (
        <img
            src={src}
            alt={
                data && has(data, 'alt_text') && data.alt_text
                    ? data.alt_text
                    : alt
            }
        />
    );
}

export default Media;

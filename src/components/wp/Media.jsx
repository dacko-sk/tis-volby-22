import { useQuery } from '@tanstack/react-query';
import has from 'has';
import { imgPath } from '../../api/helpers';
import Loading from '../Loading';

function Media({ id, fallback }) {
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
            : imgPath(fallback || 'politician.png');
    const alt =
        data && has(data, 'alt_text') ? data.alt_text : 'ilustračný obrázok';

    return <img src={src} alt={alt} />;
}

export default Media;

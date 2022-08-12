import { memo, useEffect } from 'react';

const FbFeed = memo(({ appId, name, url }) => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = `https://connect.facebook.net/sk_SK/sdk.js#xfbml=1&version=v14.0&appId=${appId}&autoLogAppEvents=1`;
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="fb-feed">
            <div id="fb-root" />
            <div
                className="fb-page"
                data-href={url}
                data-tabs="timeline"
                data-width=""
                data-height="400"
                data-small-header="true"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
            >
                <blockquote cite={url} className="fb-xfbml-parse-ignore">
                    <a href={url}>{name}</a>
                </blockquote>
            </div>
        </div>
    );
});

export default FbFeed;

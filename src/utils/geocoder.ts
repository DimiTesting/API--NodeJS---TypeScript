import nodeGeocoder from 'node-geocoder';

const options: nodeGeocoder.Options = {
    provider: 'mapquest',
    apiKey: 'XqXjAi30m6vfF6YV3QSxbfjtbmlgHja6',
    formatter: null
}

const geocoder = nodeGeocoder(options);

export default geocoder
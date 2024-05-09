const apiKeys = new Map();
apiKeys.set('F7DC013C18F1C42D317EBA8D83873C5E2C3187C4C2477CE6EE9E43C19F4BD581', true);
apiKeys.set('AD1EF5F76C7B62A0CF3F40656A8487786C8E18A7252C3F2E03B2F69717E3CAC2', false);

const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || !apiKeys.has(apiKey) || !apiKeys.get(apiKey)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
}

module.exports = {
	apiKeyAuth,
};
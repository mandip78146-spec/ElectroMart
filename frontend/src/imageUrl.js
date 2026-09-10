const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const getImageUrl = (image) => {
    if (!image) {
        return '';
    }

    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    const filename = image.replace(/^\/?uploads\//, '');
    return `${API_BASE_URL}/uploads/${encodeURIComponent(filename)}`;
};

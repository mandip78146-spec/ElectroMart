import { API_BASE_URL } from "./api";

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

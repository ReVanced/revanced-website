export function supportsWebP() {
    return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
}
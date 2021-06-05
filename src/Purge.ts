const minify = require('@node-minify/core');
const cleanCSS = require('@node-minify/clean-css');
const {PurgeCSS} = require('purgecss');

const fs = require('fs');
const path = require('path');
// @ts-ignore
const appDir = path.dirname(require.main.filename).replace('dist', '/src');

export default class Purge {
    public static async PurgeCSS(): Promise<void> {
        console.log('Running purge');

        const css = await new PurgeCSS().purge({
            content: [
                appDir + '/views/*.twig',
                appDir + '/views/*/*.twig',
                appDir + '/static/js/*.js',
                appDir + '/utils/ColorHelper.ts'
            ],
            css: [
                appDir + '/static/css/*.css'
            ],
            whitelist: [
                '::-webkit-scrollbar-track',
                '::-webkit-scrollbar-thumb',
                'ya-lightbox-body',
                'ya-lightbox-item',
                'ya-lightbox-close',
                'ya-lightbox-img',
                'ya-lightbox-backdrop',
                'btn-twitter',
                'btn-soundcloud',
                'btn-youtube',
                'btn-facebook',
                'btn-spotify',
                'btn-twitch',
                'ya-youtube',
                'mod-type-accepted',
                'mod-type-ignored',
                'mod-type-pending',
                'mod-type-denied',
                'mod-type-suggestion',
                'mod-type-issue',
                'mod-accepted',
                'mod-ignored',
                'mod-pending',
                'mod-denied'
            ],
            variables: true,
            rejected: true
        });

        fs.writeFile(appDir + '/static/styles/app.css', '', function (err) {
            if (err) return console.log(err);
        });

        // Reverse order to overwrite
        for (let i = css.length - 1; i >= 0; i--) {
            fs.appendFileSync(appDir + '/static/styles/app.css', css[i].css);
        }

        minify({
            compressor: cleanCSS,
            input: appDir + '/static/styles/app.css',
            output: appDir + '/static/styles/app.css',
            callback: function (err, min) {
            }
        });
    }
}
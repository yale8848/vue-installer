var vi = require('../lib/VueInstaller');
vi.install({
    src: 'src',
    vue: '.vue',
    flag: '@github',
    github: 'https://github.com',
    components: 'src/components'
});
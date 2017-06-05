# vue-installer
vue component installer from github

## install 

```
npm install vue-installer --save-dev

```

## config

- webpack.base.conf.js add alias @github to src/components dir

```
module.exports = {
    ...
    resolve: {

        alias: {
            '@github': path.resolve(__dirname, '../src/components')
        }
    }
    ...
}
```

- webpack.dev.conf.js add plugin

```
    var vueInstaller = require('vue-installer');
   
    plugins: [
        ...
        new vueInstaller()
        ...
    ]
```

dafalut config:

```
    plugins: [
        ...
        new vueInstaller({
            src: 'src', //main develop dir ; defalut is `src`
            vue: ['.vue','.js'],//will deal files suffix ; defalut is  `['.vue','.js']`
            flag: '@github', //flag,it will use in vue or js files;defalut is `@github`
            github: 'https://github.com',//github adress ; defalut is `https://github.com`
            components: 'src/components'//components will download dir; defalut is `'src/components'`
        })
        ...
    ]
```

- use '@github' flag in files,just like :

```
 import Calendar from '@github/LLawlight/vue-calendar/src/components/Calendar'

```

it will download https://github.com/LLawlight/LLawlight.git /src to 'src/components/LLawlight/LLawlight/src'

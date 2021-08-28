class FetchTextService {
    token = 'kQTkSakyJyBTsjhDp6UwtQtt';
    texts = [];

    async getText() {
        const localCache = localStorage.getItem('cacheVersion');
        const cacheVersion = await this.getCacheVersion();
        this.texts = JSON.parse(localStorage.getItem('texts'));
        if (!this.texts || cacheVersion != localCache) {
            this.texts = await this.fetchTexts();
            return this.getRandomText(this.texts);
        } else {
            return this.getRandomText(this.texts);
        }
    }

    getRandomLocalText(oldTextContent) {
        const total = this.texts.length;
        let indice, text;
        do {
            indice = Math.floor(Math.random() * total);
            text = this.texts[indice];
        } while(text.content.content == oldTextContent && total > 1);
        return text;
    }

    getRandomText(texts) {
        const total = texts.length;
        const indice = Math.floor(Math.random() * total);
        return texts[indice];
    }

    getCacheVersion() {
        return new Promise((resolve, reject) => {
            const token = this.token;
            const url = 'https://api.storyblok.com/v1/cdn/spaces/me?token=' + token;
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    const cacheVersion = response.space.version;
                    localStorage.setItem('cacheVersion', cacheVersion);
                    resolve(cacheVersion);
                })
                .catch(error => {
                    reject('pas de cache version');
                });
        });
    }

    fetchTexts() {
        return new Promise((resolve, reject) => {
            const token = this.token;
            const localCache = localStorage.getItem('cacheVersion');
            const cv = localCache ? '&cv=' + localCache : '';
            const url = 'https://api.storyblok.com/v1/cdn/stories?filter_query[component][in]=text&token=' + token + cv;
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    localStorage.setItem('texts', JSON.stringify(response.stories));
                    resolve(response.stories);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

export default FetchTextService;
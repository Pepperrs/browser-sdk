// getAllModels
import Ajax from '../tools/ajax.js'

export
let cache = {
    init:()=>{

    },
    public: {
        toArray: [],
        toDictionary: {}
    },
    clear:()=>{
        cache.public.toArray =[];
        cache.public.toDictionary =[];
    }
}

export
default class Model {
    constructor(modelId = null, config) {
        this.config = config;
        this.ajax = new Ajax(config.ajax);
        if (modelId) {
            this.modelId = modelId
        }
    }

    getAllModels() {
        return new Promise((resolve, reject) => {
            if (cache.public.toArray.length > 0) {
                resolve(cache.public.toArray);
            } else {
                this.ajax.get('device-models?limit=100000', null, "application/hal+json").then((response) => {
                    cache.public.toArray = response.models
                    this._makeDictionary(cache.public.toArray);
                    resolve(cache.public.toArray)
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    }

    getModel(modelId) {
        if (this.modelId && !modelId) {
            modelId = this.modelId;
        }

        if (cache.public.toDictionary[modelId]) {
            return new Promise((resolve, reject) => {
                resolve(cache.public.toDictionary[modelId]);
            })
        } else {
            return new Promise((resolve, reject) => {
                this.ajax.get(`device-models/${modelId}`, null, "application/hal+json").then((model) => {
                    cache.public.toArray.push(model)
                    cache.public.toDictionary[modelId] = model;
                    resolve(model)
                }).catch((error) => {
                    reject(error);
                });
            });
        }
    }

    _getModelById(modelId) {
        if (cache.public.toArray.length > 0) {
            return (cache.public.toDictionary[modelId] || null);
        } else {
            return null
        }
    }

    _getPublicModelsFromArray() {
        return cache.public.toArray || []
    }

    _getPublicModelsFromDictionary() {
        return cache.public.toDictionary || []
    }

    _makeDictionary(modelsArray) {
        if (!modelsArray) {
            return;
        }
        if (!cache.public.toDictionary) cache.public.toDictionary = {};
        var len = modelsArray.length;
        let i = 0;
        while (len--) {
            let model = modelsArray[i];
            cache.public.toDictionary[model.id] = model;
            i++;
        }
        return cache.public.toDictionary;
    }
}
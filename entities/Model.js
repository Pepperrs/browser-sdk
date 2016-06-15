// getAllModels
import Ajax from '../tools/ajax.js'

export
let cache = {
    public: {
        toArray: [],
        toDictionary: {}
    }
}

export
default class Model {
    constructor(config) {
        this.config = config;
        this.ajax = new Ajax(config.ajax);
    }

    getAllModels() {
        return new Promise((resolve, reject) => {
            if (cache.public.toArray.length > 0) {
                resolve(cache.public.toArray);
            } else {
                this.ajax.get('device-models?limit=100000', null).then((response) => {
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
        return new Promise((resolve, reject) => {

            if (cache.public.toArray.length > 0) {
                resolve(cache.public.toDictionary[modelId]);

            } else {
                this.getAllModels().then(() => {
                    this.getModel(modelId).then((model) => {
                        resolve(model)
                    });
                });
            }
        });
    }

    _getPublicModelsFromArray() {
        return cache.public.toArray || []
    }

    _getPublicModelsFromDictionary() {
        return cache.public.toDictionary || []
    }

    _makeDictionary(modelsArray) {
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

    its() {
        var cache = {
            modelCache: {},
            modelCacheArray: [],
            modelCachePrototypes: {},
            modelCachePrototypesArray: [],
            initialized: false,
            bustCache: function() {
                cache.initialized = false;
                cache.modelCache = {};
                cache.modelCachePrototypes = {};
                cache.modelCacheArray = [];
                cache.modelCachePrototypesArray = [];
            },
            makeCache: function() {
                var defer = $q.defer();
                if (cache.initialized) {
                    defer.resolve();
                    return defer.promise;
                }
                deviceFactory.getAllModels().then(function(data) {
                    cache.initialized = true;
                    cache.modelCacheArray = data.models;
                    for (var i = data.models.length - 1; i >= 0; i--) {
                        var model = data.models[i];
                        cache.modelCache[model.id] = model;
                    }

                    if (configService.promise) {
                        configService.promise.then(function() {
                            if (!configService.uId) {
                                defer.resolve();
                            } else {
                                deviceFactory.getAllPrototypeModels().then(function(data) {
                                    cache.modelCachePrototypesArray = data.prototypes;
                                    if (data) {
                                        for (var i = data.prototypes.length - 1; i >= 0; i--) {
                                            var model = data.prototypes[i];
                                            cache.modelCachePrototypes[model.id] = model;
                                        }
                                    }
                                    defer.resolve();
                                });
                            }
                        }, defer.reject);
                    } else {
                        defer.resolve();
                    }
                });

                return defer.promise;
            }
        };
    }
}
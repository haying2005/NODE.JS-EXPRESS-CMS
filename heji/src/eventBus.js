import Vue from 'vue'
var langs = require('./languageConfig.json')
const eventBus = new Vue({
    created() {
        console.log('event bus created.');
        this.$nextTick(_ => {
            this.fetchAllCategorys();
        });
    },
    mounted() {
    },
    data: {
        isLogin: false,
        categorys: [],
        oriCategorys: [],

        fetchingPromise: null,

        langs: langs,
    },

    methods: {
        fetchAllCategorys() {
            if (this.fetchingPromise) {
                return this.fetchingPromise;
            }
            this.fetchingPromise = this.$http.get('/categorys/list', { credentials: true })
                .then(response => {
                    var obj = response.body;
                    if (obj.code == 0) {
                        this.oriCategorys = obj.data;
                        this._sortAllCategorys();
                        console.log('--------------->获取所有类目成功.');
                        return this.categorys;
                    }
                    else {
                        throw new Error(obj.description);
                        //this.$message.error(obj.description);
                    }
                })
                .catch(err => {
                    console.log(err.message);
                    this.fetchingPromise = null;
                })
                .finally(() => {
                    //console.log('请求所有类目完毕.');
                });

            return this.fetchingPromise;
        },

        reloadAllCategorys() {
            this.fetchingPromise = null;
            this.fetchAllCategorys();
        },

        _sortAllCategorys() {
            let arr = this.oriCategorys
            this.categorys = [];
            for (let i = 0; i < arr.length; i++) {
                let father = arr[i];
                father.children = [];
                //为适应elementUI空间需要的字段
                father.label = father.name;
                father.value = father._id;

                if (father.level == 0) {
                    this.categorys.push(father);
                }
                for (let j = 0; j < arr.length; j++) {
                    let child = arr[j];

                    if (child.fatherId == father._id) {
                        child.father = father;
                        father.children.push(child);
                    }
                }

                if (!father.children.length) {
                    father.children = undefined;
                }
            }

            console.log(this.categorys);
        },

        addCategory(child) {
            this.oriCategorys.push(child);
            this._sortAllCategorys();

        },

        deleteCategory(child) {
            let index = this.oriCategorys.indexOf(child);
            if (index >= 0) {
                this.oriCategorys.splice(index, 1);
                this._sortAllCategorys();
            }
            else {
                console.log('删除出错.');
            }
        },

        getCategoryById(id) {
            for (let i = 0; i < this.oriCategorys.length; i++) {
                if (this.oriCategorys[i]._id == id) {
                    return this.oriCategorys[i];
                }
            }
        },

        //element-ui 的级联选择器需要的数据结构
        getInheritListArr(id) {
            let category = this.getCategoryById(id);
            //console.log(category);
            let arr = [];
            let findFather = function (c) {
                //console.log(c.value);
                arr.push(c.value);
                if (c.father) {
                    findFather(c.father);
                }
            }
            findFather(category);
            return arr.reverse();
        },

        logout() {

        },

    }
});

export default eventBus;


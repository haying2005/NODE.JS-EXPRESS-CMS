<template>
    <div>
        <el-cascader change-on-select :show-all-levels="false"  :options="bus.categorys" v-model="selectedOptions" @change="handleChange">
        </el-cascader>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                options: [],
                selectedOptions: [],
                categorys: [],
                bus: this.$bus,
            }
        },
        methods: {
            handleChange() {
                //console.log(this.selectedOptions);
                console.log(this.selectedOptions[this.selectedOptions.length - 1]);
            },
        }
    }

</script>
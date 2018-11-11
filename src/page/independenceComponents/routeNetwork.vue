<template>
    <div class="route-network">
        <div class="user-select" v-if="role.role!='2'">
            航点
            <div id='turnLine1' @click="changePoint" :class="{'iskg0':!ched1,'iskg1':ched1}" class='iskg'>
                <span :class="{'iskgCkecked':ched1}" class='turn-off'>&#xe61e;</span>
            </div>
        </div>
        <section class="model-magic" :class="{'max-model-magic':max_model_magic}" @mouseenter="showModeIcon(true)" @mouseleave="showModeIcon(false)">
            <div v-show="modelTag" @click="changeMode('modelTag')"><img src="./../../../static/img/model/modelTag.png" alt=""></div>
            <div v-show="modelPao" @click="changeMode('modelPao')"><img src="./../../../static/img/model/modelPao.png" alt=""></div>
        </section>
    </div>

</template>
<script>
    import * as vx from 'vuex';
    import tabulationBoxTrigger from "$src/public/js/tabulationBoxTrigger.js";
    export default {
        data() {
            return {
                ched1: true,
                modelTag:false,
                modelPao:true,
                setIcon:'modelTag',
                max_model_magic:false
            }
        },
        methods: {
            changeViewMode(t){
                if(t != undefined){
                    this.$ajax({
                        method: 'post',
                        url: '/changeViewMode',
                        params: {
                            viewMode: t,
                        },
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        }
                    })
                        .then((response) => {
                            if(response.data.opResult === 0){
                                let role = JSON.parse(sessionStorage.getItem("role"));
                                role.viewMode = t;
                                sessionStorage.setItem("role",JSON.stringify(role));
                            }
                        })
                        .catch((error) => {
                                console.log(error);
                            }
                        );
                }
            },
            changePoint(){
                this.ched1 = !this.ched1;

            },
            changeMode(t){
                switch (t){
                    case 'modelTag':
                        this.setIcon = "modelTag";
                        this.changeViewMode(1);
                        break;
                    case 'modelPao':
                        this.setIcon = "modelPao";
                        this.changeViewMode(0);
                        break;
                };
            },
            showModeIcon(t){
                if(t){
                    this.max_model_magic = true;
                    this.modelTag = true;
                    this.modelPao = true;
                }else{
                    this.max_model_magic = false;
                    if(this.setIcon === "modelTag"){
                        this.modelTag = true;
                        this.modelPao = false;
                    }else if(this.setIcon === "modelPao"){
                        this.modelTag = false;
                        this.modelPao = true;
                    }
                }
            }
        },
        computed:{
            ...vx.mapGetters([
                'role'
            ])
        },
        mounted:function () {
            let paoOrTag = this.role.viewMode === 0 ? true : false;

            if(paoOrTag){
                this.modelTag = false;
                this.modelPao = true;
                this.setIcon = 'modelPao';
            }else{
                this.modelTag = true;
                this.modelPao =false ;
                this.setIcon = 'modelTag';
            }
            let mes1 = localStorage.getItem('ched1');
            if(mes1 != null){
                this.ched1 = eval(mes1);
                tabulationBoxTrigger.$emit('allPoint',this.ched1);
            };
        }
    }
</script>
<style scoped lang="scss">
    .max-model-magic{
        width: 189px !important;
    }
    .model-magic{
        width: 105px;
        height: 50px;
        transform: translate(40px,40px);
        background-color: white;
        border-radius: 5px;
        padding: 5px;
        overflow: hidden;
        /*&:hover{*/
            /*width: 189px;*/
        /*}*/
        >div:nth-child(1):before{
            content: '图标模式';
            position: absolute;
            top:30px;
            left: 35px;
        }
        >div:nth-child(2){
            margin-right: 0;
            &:before{
                content: '气泡模式';
                position: absolute;
                top:30px;
                left: 35px;
            }
        }
        >div{
            /*pointer-events: none;*/
            float: left;
            border-radius: 5px;
            overflow: hidden;
            width: 90px;
            height:50px;
            margin-right: 5px;
            position: relative;
            border: 1px solid transparent;
            cursor: pointer;
            &:hover{
                border: 1px solid #71c8ff;
            }
        }
    }
    .route-network {
        position: absolute;
        right: 0px;
        bottom: 40px;
        color: #605E7C;
        >div{
            display: flex;
            justify-content:flex-end ;
            height: 30px;
        }
    }
    .iskg {
        display: inline-block;
        width: 35px;
        height: 16px;
        border-radius: 8px 8px 8px 8px;
        vertical-align: top;
        margin-right: 10px;
        cursor: pointer;
        position: relative;
        background-color:#605E7C;
        margin-left: 10px;
    }
    .iskg0 {
        background-color:#57b57a;
    }
    .turn-off {
        font-family: iconfont;
        font-size: 12px;
        color: white;
        position: relative;
        left: 3px;
        top: 1px;
        transition: left .15s linear;
    }

    .iskg0:before {
        content: 'ON';
        position: absolute;
        right: -1px;
        font-size: 12px;
        bottom: 1px;
        color: white;
        transform: scale(.7);
    }

    .iskg1:before {
        content: 'OFF';
        position: absolute;
        left: -2px;
        font-size: 12px;
        bottom: 1px;
        color: white;
        transform: scale(.7);
    }

    .iskgCkecked {
        left: 20px;
    }
</style>
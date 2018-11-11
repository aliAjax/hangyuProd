export default class MesTip {
    constructor(node) {
        if (node === undefined) {
            throw '构造函数传入的节点不能为空';
        }
        ;
        this.node = node; // 目标节点
        this.createNode = this.initNode(); // 提示节点
        this.correctionX = 0;
        this.correctionY = 0;
        window.onresize  = ()=>{
            this.resizeText();
        }
    }

    /**
     * 初始化节点
     * */
    initNode() {
        let creactNode = document.createElement("div");
        return creactNode;
    }

    /**
     * 移除节点
     *
     * */
    removeNode() {
        document.body.removeChild(this.createNode);
    }

    /**
     * 添加节点
     *
     * */
    addNode() {
        document.body.appendChild(this.createNode);
        this.resizeText();
    }
    /**
     * 窗口改变修改节点位置
     *
     * */
    resizeText(){
        let dom = this.node.getBoundingClientRect();
        this.createNode.style.top = `${dom.top + dom.height + this.correctionY}px`;
        this.createNode.style.left = `${dom.left +3}px`;
        this.createNode.style.zIndex = 999;
        this.createNode.style.color = 'red';
        this.createNode.style.position = 'absolute';
    }
    /**
     * 修改提示文字节点
     *
     * */
    changeText(text) {
        this.createNode.innerHTML = text;
    }
    /**
     * 设置修正节点位置
     * */
    setCorrectionX(val){
        this.correctionX = val;
    }
    setCorrectionY(val){
        this.correctionY = val;
    }
}



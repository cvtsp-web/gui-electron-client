import popover from '@/mixins/popover'
import { MessageBox, Message } from 'element-ui'
//import Clickoutside from 'element-ui/lib/utils/clickoutside';
import { mapMutations } from 'vuex'

export default {
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        }
    },

    mixins: [popover],

    data() {
        return {
            contextmenu: null,
            startClick: null,
            // 当前选中的数据
            currentData: null,
            currentSlot: '',
            dialog: {
                visible: false,
                title: '插槽',
                from: null,
                to: null
            }
        }
    },

    computed: {
        findComponentLists() {
            const results = this.getTrees(this.data, 0);      
            return results;      
        }
    },

    mounted() {
        this.$dragging.$on('dragged', ({draged, to, group}) => {
            if(group === 'draw') {
                if(Array.isArray(to.slots) && to.slots.length > 0) {
                    this.dialog.visible = true;
                    this.dialog.from = draged;
                    this.dialog.to = to;
                }else {
                    Message.warning('没有插槽,无法插入!')
                }
                
                // this.modifyDrawComponents({
                //     ...draged,
                //     pid: to.id
                // });
            }
        });

        document.addEventListener('mousedown', e => this.startClick = e);
        document.addEventListener('mouseup', e => this.documentHandler(e, this.startClick))
    },

    /**
    * @example: 
    *[{props: '', ..., children: [{}]}, {props: ''}]
     */
    render(h) {
        return h(
            'div', 
            this.iterationComponents(h, this.findComponentLists)
            .concat([this.renderPopoverTpl(), this.renderDialogTpl()])
        );
    },

    methods: {
        ...mapMutations('Main', [
            'deleteDrawComponents',
            'modifyDrawComponents'
        ]),

        renderPopoverTpl() {
            return (
                <el-popover 
                    ref="popover" 
                    placement="bottom">
                    <div ref="content">
                        <el-form>
                            <el-form label="删除">
                                <el-button size="mini" type="primary" onClick={this.saveFromLibrary}>保存配置</el-button>
                                <el-button size="mini" onClick={this.removeFromLibrary}>删除</el-button>
                            </el-form>
                        </el-form>
                    </div>
                </el-popover>
            )
        },

        renderDialogTpl() {
            return (
                <el-dialog {...{
                    props: {
                        visible: this.dialog.visible,
                        title: this.dialog.title
                    },
                    on:{'update:visible': (val) => this.dialog.visible = val}}}>
                    <el-select value={this.currentSlot} onChange={this.dialogSlotChange}>
                        {
                           this.dialog.to && this.dialog.to.slots.map(slot => (
                               <el-option label={slot} value={slot}></el-option>
                           ))
                        }
                    </el-select>
                </el-dialog>
            )
        },

        dialogSlotChange(val) {
            console.log(val)
            this.currentSlot = val;
        },

        iterationComponents(h, components) {
            if(!components.length) return [];

            return components.map(component => {
                return h(
                    component.name, 
                    {   
                        props: {
                            key: component.id
                        },
                        nativeOn: {
                            contextmenu: (event) => this.handlerContextmenu(event, component)
                        },
                        directives: [
                            {
                                name: 'dragging',
                                value: {item: component, group: 'draw', key: component.id}
                            }
                        ]
                    }, 
                    component.children ? this.iterationComponents(h, component.children) : []
                );
           });
        },

        handlerContextmenu(event, mess) {  
            this.contextmenu = event.target;
            this.mixins_hidePopover(this.$refs['popover']);
            this.currentData = mess;

            setTimeout(() => {
                this.mixins_showPopover(this.$refs['popover'], event.target)
            });
            
        },

        documentHandler(mouseup, mousedown) {
            const content = this.$refs['content'];
            if(content && 
                content.parentNode &&
                content.parentNode.style.display !== 'none' &&
                this.contextmenu !== content &&
                mouseup.target !== content) {
                if(this.contextmenu !== mouseup.target || content.contains(mousedown.target))
                this.mixins_hidePopover(this.$refs['popover'])
            }
        },

        /**
        * 从库组件中删除 制定id的数据
         */
        removeFromLibrary() {
            if(!this.currentData) return;
            this.deleteDrawComponents(this.currentData.id);
        },

        saveFromLibrary() {
            
        },

        /**
        * 1. 取出数组的第一个(id)和剩下的数据(pid)进行比较,相同说明都是第一个的子集合
        * 2. 存在到它的children中
        * 树状的算法
        * @params list     代转化数组
        * @params parentId 起始节点
        */
        getTrees(list, parentId) {
            let items = {};
            // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
            for (let i = 0; i < list.length; i++) {
                let key = list[i].pid;
                if (items[key]) {
                    items[key].push(list[i]);
                } else {
                    items[key] = [];
                    items[key].push(list[i]);
                }
            }
            const results = formatTree(items, parentId);
            
            return results

            /**
            * 利用递归格式化每个节点
            */
            function formatTree(items, parentId) {
                let result = [];
                if (!items[parentId]) {
                    return result;
                }
                for (let t of items[parentId]) {
                    t.children = formatTree(items, t.id)
                    result.push(t);
                }
                return result;
            }
        }
    }
}
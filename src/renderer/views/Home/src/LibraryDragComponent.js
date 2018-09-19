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
            currentData: {},
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
        // queryComponentLists() {
        //     return this.getTrees(this.data, 0);      
        // }
    },

    mounted() {
        this.$dragging.$on('dragged', ({draged, to, group}) => {
            if(group === 'draw') {
                if(Array.isArray(to.slots) && to.slots.length > 0) {
                    this.currentSlot = '';
                    this.dialog.visible = true;
                    this.dialog.from = draged;
                    this.dialog.to = to;
                }else {
                    Message.warning('没有插槽,无法插入!')
                }
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
            this.iterationComponents(h, this.data)
            .concat([this.renderPopoverTpl(), this.renderDialogTpl()])
        );
    },

    methods: {
        ...mapMutations('Main', [
            'deleteDrawComponents',
            'modifyDrawComponents'
        ]),

        renderPopoverTpl() {
            // 动态生成form-item
            const formItem = this.currentData 
                && Array.isArray(this.currentData.propLists)
                && this.currentData.propLists.map(item => {
                return (
                    <el-form-item label={item.name + ':'}>
                        {
                            item.type === 'boolean' 
                                ? <el-switch value={item.input} onChange={(val) => item.input = val} /> 
                                : <el-input value={item.input} onChange={(val) => item.input = val} />
                        }
                    </el-form-item>
                )
            });
            return (
                <el-popover 
                    ref="popover" 
                    placement="bottom">
                    <div ref="content">
                        <el-form model={this.currentData} label-width="80px" ref="propsform">
                            {formItem}
                            <el-form label="删除" style={{textAlign: 'center'}}>
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
                        title: this.dialog.title,
                        width: '30%'
                    },
                    on:{'update:visible': (val) => this.dialog.visible = val}}}>
                    <el-select 
                        style={{width:'100%'}} 
                        value={this.currentSlot} 
                        onChange={(val) => this.currentSlot = val}>
                        {
                           this.dialog.to && this.dialog.to.slots.map(slot => (
                               <el-option label={slot} value={slot}></el-option>
                           ))
                        }
                    </el-select>
                    <span slot="footer">
                        <el-button onClick={() => this.dialog.visible = false}>取 消</el-button>
                        <el-button type="primary" onClick={this.handlerConfirm}>确 定</el-button>
                    </span>
                </el-dialog>
            )
        },

        /**
        * 弹框确定事件
        * currentSlot为空 只关闭弹框
        */
        handlerConfirm() {
            const { from, to } = this.dialog;
            if(this.currentSlot === '') {
                return this.dialog.visible = false;
            };

            this.modifyDrawComponents({
                ...from,
                slot: this.currentSlot,
                pid: to.id
            });
            this.dialog.visible = false;
        },

        iterationComponents(h, components) {
            if(!components.length) return [];
            
            return components.map(component => {
                return h(
                    // defaultName 为渲染时的组件名称
                    component.defaultName ? component.defaultName : component.name, 
                    {   
                        props: {
                            key: component.id,
                            ...component.props,
                            slots: component.slots
                        },
                        nativeOn: {
                            contextmenu: (event) => this.handlerContextmenu(event, component)
                        },
                        directives: [
                            {
                                name: 'dragging',
                                value: {item: component, group: 'draw', key: component.id}
                            }
                        ],
                        slot: component.slot
                    }, 
                    this.iterationComponents(h, component.children)
                );
           });
        },

        handlerContextmenu(event, mess) {  
            event.stopPropagation();
            this.contextmenu = event.target;
            this.mixins_hidePopover(this.$refs['popover']);
            // 赋值当前的数据信息
            this.currentData = mess;

            setTimeout(() => {
                this.mixins_showPopover(this.$refs['popover'], event.target)
            }, 0);
            
        },

        documentHandler(mouseup, mousedown) {
            const content = this.$refs['content'];
            if(content && 
                content.parentNode &&
                content.parentNode.style.display !== 'none' &&
                this.contextmenu !== content &&
                mouseup.target !== content) {
                if(this.contextmenu !== mouseup.target && !content.contains(mousedown.target))
                this.mixins_hidePopover(this.$refs['popover'])
            }
        },

        /**
        * 从库组件中删除 制定id的数据
         */
        removeFromLibrary() {
            if(!this.currentData) return;
            this.mixins_hidePopover(this.$refs['popover']);
            this.deleteDrawComponents(this.currentData.id);
        },

        /**
        * 保存的修改的props属性
        */
        saveFromLibrary() {
            this.$refs['propsform'].validate(valid => {
                var props = {};
                if(Array.isArray(this.currentData.propLists)) {
                    this.currentData.propLists.forEach(val => {
                        props[val.name] = val.input;
                    })
                };
                this.modifyDrawComponents({
                    ...this.currentData,
                    props
                });    
                this.mixins_hidePopover(this.$refs['popover']);    
            })
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
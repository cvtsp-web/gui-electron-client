import './style.scss'

export default {
    name: 'PlaceholderComponent',

    props: {
        slots: {
            type: Array,
            default() {
                return []
            }
        }
    },

    watch: {
        slots: {
            immediate: true,
            handler(val) {
                console.log(val)
            }
        }
    },

    render(h) {
        return h('div', {
            class: {
                'default-component': true
            }
        }, this.slots.map(slot => this.$slots[slot]))
    }
}
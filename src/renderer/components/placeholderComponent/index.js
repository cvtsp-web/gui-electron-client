import PlaceholderComponent from './placeholderComponent'

PlaceholderComponent.install = function(Vue) {
    Vue.component(PlaceholderComponent.name, PlaceholderComponent);
}

export default PlaceholderComponent;
import { vue } from './template.conf'
import { basename } from './utils'
import { Message } from 'element-ui'
import fs from 'fs'
import path from 'path'
import os from 'os'
import render from 'json-templater/string'

export default class GeneratorPage {
    constructor() {
        this.vue = vue;
    }

    /**
     * 创建文件模版
     * @param {Object} 
     * options: {   dirName: value,
     *              targetPath: params.path,
     *              inject: [],
     *              stylePostfix: ''}
     */
    create(options) {
        Object.keys(options).forEach(val => {
            this[val] = options[val];
        });

        this.createRootDir();
    }

    /**
     * 创建根文件夹
     */
    createRootDir() {
        this.dirPath = `${this.targetPath}/${this.dirName}`;
        if(!fs.existsSync(this.dirPath)) {
            fs.mkdirSync(this.dirPath);
            this.generatorTemplateDir();
        }else {
            Message.warning('文件重名, 请修改')
        }
    }

    generatorTemplateDir() {
        if(this.frame) {
            this[this.frame + 'GeneratorTemplateDir']();
        }else {
            throw Error('you must choose a frame');
        }
    }

    vueGeneratorTemplateDir() {
        const templateDir = this.vue.templateDir;  //Array
        if(! Array.isArray(templateDir)) throw Error('templateDir is must be a Array!');

        templateDir
        .map(tpl => {
            tpl.name = tpl.name.replace(/<(\w+)>/g, (math, val) => {
                return this[val] && this[val];
            });
            return tpl;
        })
        .forEach(tpl => {            // tpl = { name, type}
            let filePath = `${this.dirPath}/${tpl.name}`;
            tpl.type === 'dir' ? fs.mkdirSync(filePath) : wirteTemplateInFiles.call(this, filePath, tpl);
        });

        function wirteTemplateInFiles(filePath, item={}) {         
            if(/.vue$/.test(item.name)) {
                fs.writeFileSync(filePath, vueTemplateParse.call(this, (item)));
            }else {
                fs.writeFileSync(filePath);
            }
        }

        function vueTemplateParse(params) {
            const template = this.vue.template;
            return render(template, {
                inject: [
                    '<div>',
                    '<el-input />',
                    '<el-select>',
                    '<div />'
                ].join('' + os.EOL),
                name: path.basename(params.name, '.vue')
            })
        }
    }
}